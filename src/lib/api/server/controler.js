import {TokenGenerator} from "$lib/api/server/token-util.js";
import {Tag} from "$lib/api/server/db.js";

// an asset represents one image in a story,
// there are translated versions that can have different resolutions,
// different formats etc,
// but they belong under one asset since they represent one thing

const mockAssets = [
    {
        parent_id: "0a41ef00-955b-4717-b51f-4680a7adbacc",
        path: "/asset/test/1.png",
        height: 188,
        width: 268,
        lang: "eng",
        format: "png"
    },
    {
        parent_id: "0a41ef00-955b-4717-b51f-4680a7adbacc",
        path: "/asset/test/1.png.avif",
        height: 188,
        width: 268,
        lang: "eng",
        format: "avif"
    },
    {
        parent_id: "8d659dc0-9af6-446a-bba6-8a2ec67cc42f",
        format: 'png',
        path: "/asset/test/2.png",
        width: 720,
        height: 1280,
        lang: "eng"
    },
    {
        parent_id: "8d659dc0-9af6-446a-bba6-8a2ec67cc42f",
        type: 'avif',
        path: "/asset/test/2.png.avif",
        width: 720,
        height: 1280,
        lang: "eng"
    },
    {
        parent_id: "5045e66c-1e12-4106-a349-ec5d9bb51a8a",
        path: "/asset/test/3.png",
        width: 1280,
        height: 720,
        lang: "eng",
        format: "png"
    },
    {
        parent_id: "5045e66c-1e12-4106-a349-ec5d9bb51a8a",
        path: "/asset/test/3.png.avif",
        width: 1280,
        height: 720,
        lang: "eng",
        format: "avif"
    },
    {
        parent_id: "45634430-479f-4585-9701-00c5ee4f3528",
        path: "/asset/test/4.jpg",
        width: 576,
        height: 461,
        lang: "eng",
        format: "jpg"
    },
    {
        parent_id: "45634430-479f-4585-9701-00c5ee4f3528",
        path: "/asset/test/4.jpg.avif",
        width: 576,
        height: 461,
        lang: "eng",
        format: "avif"
    },
    {
        parent_id: "a6d9aec4-8b6a-4004-9711-8fbbb5919f03",
        path: "/asset/[atcesolcyc] Gladiolus/0.jpg",
        width: 989,
        height: 825,
        lang: "eng",
        format: "jpg"
    },
    {
        parent_id: "a6d9aec4-8b6a-4004-9711-8fbbb5919f03",
        path: "/asset/[atcesolcyc] Gladiolus/0.jpg.avif",
        width: 989,
        height: 825,
        lang: "eng",
        format: "avif"
    }
]

const mockAssetData = [
    {
        id: "0a41ef00-955b-4717-b51f-4680a7adbacc",
        parentPost: "testing_story",
        parentChapters: "b9338d67-74b6-4ede-80d7-273d594bda51"
    },
    {
        id: "8d659dc0-9af6-446a-bba6-8a2ec67cc42f",
        parentPost: "testing_story",
        parentChapters: "b9338d67-74b6-4ede-80d7-273d594bda51"
    },
    {
        id: "5045e66c-1e12-4106-a349-ec5d9bb51a8a",
        parentPost: "testing_story",
        parentChapters: "b9338d67-74b6-4ede-80d7-273d594bda51"
    },
    {
        id: "45634430-479f-4585-9701-00c5ee4f3528",
        parentPost: "testing_story",
        parentChapters: "b9338d67-74b6-4ede-80d7-273d594bda51"
    },
    {
        id: "a6d9aec4-8b6a-4004-9711-8fbbb5919f03",
        parentPost: "Gladiolus",
        parentChapters: "2d93ce41-0ae4-4e70-aa85-78043b3cc855"
    }
]

const chapterAsset = [
    {
        chapter_id: "b9338d67-74b6-4ede-80d7-273d594bda51",
        asset_id: "0a41ef00-955b-4717-b51f-4680a7adbacc",
        index_in_chapter: 0
    },
    {
        chapter_id: "b9338d67-74b6-4ede-80d7-273d594bda51",
        asset_id: "8d659dc0-9af6-446a-bba6-8a2ec67cc42f",
        index_in_chapter: 1
    },
    {
        chapter_id: "b9338d67-74b6-4ede-80d7-273d594bda51",
        asset_id: "5045e66c-1e12-4106-a349-ec5d9bb51a8a",
        index_in_chapter: 2
    },

    {
        chapter_id: "491c8e70-85ec-4164-85b1-055066509980",
        asset_id: "45634430-479f-4585-9701-00c5ee4f3528",
        index_in_chapter: 0
    }
]

const mockChapterData = [
    {
        id: "b9338d67-74b6-4ede-80d7-273d594bda51",
        published: true,
        postId: "testing_story",
        indexInParentPost: 1,
        name: "The beggining"
    },
    {
        id: "491c8e70-85ec-4164-85b1-055066509980",
        published: true,
        postId: "testing_story",
        indexInParentPost: 2,
        name: "The Middle",
    }
]

const mockData = {
    entries: [
        // {
        //     id: "Gladiolus",
        //     title: "Gladiolus",
        //     author: "atcesolcyc",
        //     created: 1673583067,
        //     geners: ["Bara/ Muscle", "Yaoi"],
        //     tags: ["Big Penis", "Tattoo", "Uncensored"],
        //     categories: ["CG/ Art"],
        //     published: true,
        //     chapter_count: 1,
        //     chapters: [
        //         {
        //             id: "testid2",
        //             name: "first",
        //             chapter_media: [
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/0.jpg.avif",
        //                     "height": 825,
        //                     "width": 989
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/1.jpg.avif",
        //                     "height": 1047,
        //                     "width": 845
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/2.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/3.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/4.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/5.jpg.avif",
        //                     "height": 1210,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/6.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/7.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/8.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/9.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/10.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/11.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/12.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/13.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/14.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/15.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/16.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 },
        //                 {
        //                     "path": "/[atcesolcyc]%20Gladiolus/17.jpg.avif",
        //                     "height": 1178,
        //                     "width": 950
        //                 }
        //
        //             ]
        //         }
        //     ]
        // },
        // {
        //     id: "Jogging",
        //     title: "Jogging",
        //     author: "Tarutoru",
        //     created: 1673583067,
        //     geners: ["Bara/ Muscle", "Yaoi"],
        //     tags: ["Blowjob", "Public Sex/ Exhibitionism"],
        //     categories: ["CG/ Art"],
        //     chapters: [
        //         {
        //             id: "testid2",
        //             name: "first",
        //             chapter_media: [
        //                 {
        //                     "path": "/Tarutoru_Jogging/1.jpg",
        //                     "height": 1000,
        //                     "width": 1331
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/2.jpg",
        //                     "height": 1000,
        //                     "width": 1331
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/3.jpg",
        //                     "height": 1000,
        //                     "width": 1331
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/4.jpg",
        //                     "height": 1000,
        //                     "width": 1331
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/5.jpg",
        //                     "height": 1210,
        //                     "width": 1331
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/6.jpg",
        //                     "height": 1000,
        //                     "width": 1331
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/7.jpg",
        //                     "height": 1000,
        //                     "width": 1483
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/8.jpg",
        //                     "height": 1000,
        //                     "width": 1483
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/9.jpg",
        //                     "height": 1000,
        //                     "width": 1483
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/10.jpg",
        //                     "height": 1000,
        //                     "width": 1483
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/11.jpg",
        //                     "height": 1000,
        //                     "width": 1483
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/12.jpg",
        //                     "height": 1000,
        //                     "width": 1483
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/13.jpg",
        //                     "height": 1000,
        //                     "width": 1483
        //                 },
        //                 {
        //                     "path": "/Tarutoru_Jogging/14.jpg",
        //                     "height": 1000,
        //                     "width": 1483
        //                 }
        //             ]
        //         }
        //     ],
        //     chapter_count: 1,
        //     posterr: {
        //         path: "/asset/Tarutoru_Jogging/thumb.avif"
        //     }
        // },
        {
            id: "testing_story",
            title: "Testing story",
            authorId: "b3384e3e-add4-4eb6-93c6-f5d1e1f69480",
            created: 1673640145,
            published: true,
            poster: "0a41ef00-955b-4717-b51f-4680a7adbacc",
            chapter_count: 2
        }
    ],
    total: 3
}

export { mockData, authorData, categoryData, tagData, mockUsers, mockAssetData, chapterAsset, mockAssets, mockChapterData }

const authorData = [
    {
        name: "Kokoniara",
        id: "b3384e3e-add4-4eb6-93c6-f5d1e1f69480"
    }
]

const categoryData = [
    {
        name: "CG/ Art",
        postId: "testing_story"
    }
]

const genersData = [
    {
        name: "Testing genere",
        postId: "testing_story"
    }
]

export { genersData }

const tagData = [
    {
        name: "Test tag 1",
        postId: "testing_story"
    },
    {
        name: "Test tag 2",
        postId: "testing_story"
    }
]

const mockUsers = [
    {
        username: "kokoniara",
        email: "kokoniara@kokoniara.software",
        id: "49e83ec0-5b61-41e8-b227-4054be3e447d",
        passHash: "7fcc7ca181147588e8a0515d7ec889611ccbe5d622a2ec169e592c711598ba8a",
        salt: "ar@",
        admin: true
    }
]

// gg from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
const getSHA256 = async (text = "") => {
    const msgUint8 = new TextEncoder().encode(text);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);     // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                      // convert buffer to byte array
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function verifyUserToken(token) {
    try {
        return new TokenGenerator().decode(token, 'a')
    } catch (_) {
        return {}
    }
}

async function authenticateUser(email, passwrd) {
    for (const user of mockUsers) {
        if (user.email !== email) {
            continue;
        }
        const hash = await getSHA256(user.salt + passwrd)
        if (hash !== user.passHash) {
            break
        } else {
            return new TokenGenerator(
                'a',
                'a',
                {
                    algorithm: 'HS256',
                    keyid: '1',
                    noTimestamp: false,
                    expiresIn: '10d',
                    notBefore: '0'
                }
            ).sign({
                username: user.username,
                id: user.id,
                admin: user.admin
            }, {
                audience: 'myaud',
                issuer: 'mrm-main-server',
                jwtid: '1',
                subject: 'user'
            });
        }
    }

    return ""
}


function getFeed(pageIndex = 0, pageSize = 10) {

    const splitStart = pageIndex * pageSize


    const splitEnd = splitStart + pageSize

    const posts = JSON.parse(JSON.stringify(mockData.entries.slice(splitStart, splitEnd)))

    posts.forEach(post => {
        delete post.chapters
    })

    return {
        posts: posts,
        hasNextPage: splitEnd < mockData.entries.length,
        pagesAvalible: Math.ceil(mockData.entries.length / pageSize)
    }
}

function getChapter(postId = "", chapterIndex = 0) {
    let outChapter = undefined

    let totalChapters = undefined

    for (const post of mockData.entries) {
        if (post.id === postId) {
            let enChapter = post.chapters[chapterIndex]
            if (enChapter) {
                outChapter = enChapter
                totalChapters = post.chapters.length
            }
            break
        }
    }


    return {
        chapter: outChapter,
        chapterCount: totalChapters
    }
}

function getPost(postId = "") {
    let outPost = undefined

    for (const post of mockData.entries) {
        if (post.id === postId) {
            outPost = JSON.parse(JSON.stringify(post))
            break
        }
    }


    if (outPost) {
        delete outPost.chapters
    }

    return outPost
}


async function getChapterData(chapterId = "") {
    for (const chapter of mockChapterData) {
        if (chapter.id === chapterId) {
            return JSON.parse(JSON.stringify(chapter)) // object clone trick
        }
    }
    return undefined
}

async function getPostData(postId = "") {
    for (const post of mockData.entries) {
        if (post.id === postId) {
            return JSON.parse(JSON.stringify(post)) // object clone trick
        }
    }
    return undefined
}

function getAssetData(assetId = "") {
    for (const asset of mockAssetData) {
        if (asset.id === assetId) {
            return JSON.parse(JSON.stringify(asset)) // object clone trick
        }
    }
    return undefined
}

async function getPopulatedChapter(chapterId = "") {
    const chapter = await getChapterData(chapterId)
    if (!chapter) return undefined
    const chptrAsts = []

    for (const {id, index} of chapter.chapter_media) {
        const asset = await getAssetData(id)
        if (!asset) return undefined // again, fail cuz this should never happen
        asset.index = index
        chptrAsts.push(asset)
    }
    chapter.chapter_media = chptrAsts

    return chapter
}


async function getPostPoster(postId = "") {
    const outPost = await getPostData(postId)

    if (!outPost) {
        return undefined
    }

    return await getAssetData(outPost.poster)
}


async function saveTags(postId = "", tags = [""]) {
    await Tag.destroy({
        where: {
            postId: postId
        }
    })

    for (const tag of tags) {
        await Tag.create({
            name: tag,
            postId: postId
        })
    }

}

async function getPostPopulated(postId = "") {

    let outPost = await getPostData(postId)

    if (!outPost) {
        return undefined
    }

    const chapters = []
    for (const chapterId of outPost.chapters) {
        const chapter = await getChapterData(chapterId)
        if (!chapter) return undefined // fail cuz the chapter should NEVER be null
        const chptrAsts = []

        for (const {id, index} of chapter.chapter_media) {
            const asset = await getAssetData(id)
            if (!asset) return undefined // again, fail cuz this should never happen
            asset.index = index
            chptrAsts.push(asset)
        }
        chapter.chapter_media = chptrAsts

        chapters.push(chapter)
    }
    outPost.chapters = chapters

    outPost.poster = await getAssetData(outPost.poster)

    return outPost
}


export {
    getFeed,
    getChapter,
    getPost,
    authenticateUser,
    verifyUserToken,
    getPostPopulated,
    getPopulatedChapter,
    getPostPoster,
    getAssetData
}