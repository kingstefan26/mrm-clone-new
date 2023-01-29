import {TokenGenerator} from "$lib/api/server/token-util.js";
import * as DB from "$lib/api/server/db.js";
import {
    Asset,
    AssetVersion,
    Author,
    Category,
    Genere,
    Pairing,
    Post,
    Scanlination,
    Status,
    Tag
} from "$lib/api/server/db.js";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import {execSync} from "child_process";

const superprivatepassphrase = 'a'

export async function createUser(data = {email:"", passHash: "", username: "",  salt:"", admin:""}) {
    let user = await DB.User.findOne({
        where: {
            email: data.email
        }
    })
    if (!user) {
        user = await DB.User.create(data)
    }
    return user
}


// gg from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
const getSHA256 = async (text = "") => {
    const msgUint8 = new TextEncoder().encode(text);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);     // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                      // convert buffer to byte array
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function verifyUserToken(token) {
    try {
        return new TokenGenerator().decode(token, superprivatepassphrase)
    } catch (_) {
        return {}
    }
}

function getMimeFromPath(filePath) {
    const mimeType = execSync('file --mime-type -b "' + filePath + '"').toString();
    return mimeType.trim();
}

export async function createAssetVersion(arrayBuffer, lang) {
    // create 'upload' dir if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'upload')

    // make sure dir exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir)
    }

    // generate a random uuid
    const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    let filePath = path.join(uploadDir, uuid);

    // create a new file in the upload dir
    const file = fs.createWriteStream(filePath, {flags: 'w'})
    file.write(arrayBuffer)
    file.end()
    // wait for the file to be written
    await new Promise(resolve => file.on('finish', resolve))

    // create a sha1 etag using response body of res
    const etag = await crypto.subtle.digest('SHA-1', arrayBuffer)
    // convert to hex
    const etagHex = Array.from(new Uint8Array(etag)).map(b => b.toString(16).padStart(2, '0')).join('')

    // get metadata
    const metadata = await sharp(filePath).metadata()


    return await AssetVersion.create({
        path: filePath,
        width: metadata.width,
        height: metadata.height,
        lang: lang,
        format: metadata.format,
        mimeType: getMimeFromPath(filePath),
        etag: etagHex,
        contentLength: arrayBuffer.byteLength
    })
}


export async function authenticateUser(email, passwrd) {
    const user = await DB.User.findOne({
        where: {
            email: email
        }
    })

    if (user === null) {
        return undefined
    }


    const hash = await getSHA256(user.salt + passwrd)
    console.log(`calculated hash: ${hash}, expected hash: ${user.passHash}`)
    if (hash === user.passHash) {
        return new TokenGenerator(superprivatepassphrase, superprivatepassphrase, {
            algorithm: 'HS256', keyid: '1', noTimestamp: false, expiresIn: '10d', notBefore: '0'
        }).sign({
            username: user.username, id: user.id, admin: user.admin
        }, {
            audience: 'myaud', issuer: 'mrm-main-server', jwtid: '1', subject: 'user'
        });
    }

    return undefined
}


export async function getFeed(pageIndex = 0, pageSize = 10, showUnpublishedPosts = false) {

    let where = {published: true}

    if (showUnpublishedPosts) {
        where = {}
    }

    let {count, rows} = await DB.Post.findAndCountAll({
        offset: pageIndex * pageSize,
        limit: pageSize,
        where: where
    });


    if (typeof rows !== 'undefined' && rows.length === 0) {
        return {
            posts: [],
            pagesAvalible: 0
        }
    }

    rows = rows.map((s) => JSON.parse(JSON.stringify(s)))

    return {
        posts: rows,
        pagesAvalible: Math.ceil(count / pageSize)
    }
}


// chapterIndex -1 means we get all the chapters
export async function getChapterWithPost(postId = "", chapterIndex = 0) {
    let post = await getPostPopulated(postId)
    if (!post) return undefined
    let processedChapters = []

    let postChapters;

    if (chapterIndex === -1) {
        postChapters = await post.getChapters();
    } else {
        postChapters = await post.getChapters({
            where: {
                indexInParentPost: chapterIndex
            }
        })
    }


    for (const chapterElement of postChapters) {
        let chapter = chapterElement
        let assets = await chapter.getAssets()

        assets = await Promise.all(assets.map(async asset => {
            let versions = await asset.getAssetData()

            versions = JSON.parse(JSON.stringify(versions))

            asset = JSON.parse(JSON.stringify(asset))

            asset.versions = versions

            return asset
        }))

        const procressedChapter = JSON.parse(JSON.stringify(chapter))
        procressedChapter.assets = assets
        processedChapters.push(procressedChapter)
    }

    if (processedChapters.length === 0) {
        console.error(`chapter ${chapterIndex} not found in post ${postId}`)
    }

    post = JSON.parse(JSON.stringify(post))

    post.chapters = processedChapters

    return post
}

export async function getTag(name = "") {
    let tag = await Tag.findOne({
        where: {
            name: name
        }
    })

    if (!tag) {
        tag = await Tag.create({
            name: name
        })
    }

    return tag
}


export async function getChapterWithAssets(postId = "", chapterIndex = 0) {
    const chapter = await DB.Chapter.findOne({
        where: {
            postId: postId,
            indexInParentPost: chapterIndex
        },
        include: [Asset]
    })

    return chapter ? JSON.parse(JSON.stringify(chapter)) : undefined
}

export async function getPostPopulated(postId = "") {
    let post = await Post.findOne({
        where: {
            id: postId
        },
        include: [Author, Category, Genere, Pairing, Scanlination, Tag, Status]
    })

    if (!post) {
        return undefined
    }

    // get poster asset and attach it
    let posterAsset = await Asset.findOne({
        where: {
            id: post.posterAssetId
        },
        include: [AssetVersion]
    })

    posterAsset = JSON.parse(JSON.stringify(posterAsset))

    post.posterAsset = posterAsset

    return post
}
