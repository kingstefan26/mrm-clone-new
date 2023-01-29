import {Asset, Author, Chapter, Post} from "$lib/api/server/db.js";
import {createNextChapter} from "$lib/api/server/controlers/ChapterController.js";

export async function POST({locals, request, params}) {
    if(!locals.user.admin) {
        return new Response(
            JSON.stringify({status: "error", message: "You are not logged in"}),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    }

    let returnData = {status: "ok"}

    const jsonres = await request.json()

    if(params.reason === "title") {
        const {title, postId} = jsonres

        console.log(`updating post ${postId} title to ${title}`)

        await Post.update({title}, {where: {id: postId}})
    }

    if(params.reason === "author") {
        const {author, postId} = jsonres

        console.log(`updating post ${postId} author to ${author}`)

        const post = await Post.findOne({where: {id: postId}})
        // create the author if it doesn't exist
        const [authorObj, created] = await Author.findOrCreate({where: {name: author}})

        await post.setAuthor(authorObj)

    }

    if(params.reason === "tags") {
        const {tags, postId} = jsonres


        console.log(`updating post ${postId} tags to `, tags)

        const post = await Post.findOne({where: {id: postId}})

        const postTags = await post.getTags()

        const toDelete = postTags.filter(tag => !tags.includes(tag.name))
        await post.removeTags(toDelete)


        const oldTagNames = postTags.map(tag => tag.name)
        const toCreate = tags.filter(tag => !oldTagNames.includes(tag))
        for (const tag of toCreate) {
            await post.createTag({name: tag})
        }
    }


    if(params.reason === "description"){
        const {description, postId} = jsonres

        console.log(`updating post ${postId} description to ${description}`)

        await Post.update({description}, {where: {id: postId}})
    }

    if(params.reason === "poster"){
        const {posterAssetId, postId} = jsonres

        console.log(`updating post ${postId} poster asset to ${posterAssetId}`)

        await Post.update({posterAssetId}, {where: {id: postId}})
    }

    if(params.reason === "published"){
        console.log(jsonres)
        const {published, postId} = jsonres

        console.log(`updating post ${postId} published to ${published}`)

        await Post.update({published: published}, {where: {id: postId}})
    }

    if(params.reason === 'chapter') {
        const {name, postId} = jsonres

        const post = await Post.findOne({where: {id: postId}})

        const chapter = await createNextChapter(post, name)

        returnData = {status: "ok", data: {newChapterId: chapter.id, chapterIndex: chapter.indexInParentPost}}
    }

    if(params.reason === 'updatechapter') {

        const {chapterId, name, published, western, sensitiveContent} = jsonres

        const chapter = await Chapter.findOne({where: {id: chapterId}})

        console.log(`updating chapter ${chapterId} with name ${name}, published ${published}, western ${western}, sensitiveContent ${sensitiveContent}`)

        chapter.name = name
        chapter.published = published
        chapter.western = western
        chapter.sensitiveContent = sensitiveContent

        await chapter.save()

    }

    if(params.reason === 'deletechapter') {
        const {chapterId} = jsonres

        await Chapter.destroy({where: {id: chapterId}})

    }

    if(params.reason === 'updateChapterAssets') {
        const {chapterId, assets} = jsonres

        const chapter = await Chapter.findOne({where: {id: chapterId}})
        // console.log(`updating chapter ${chapterId} assets to `, assets)

        // remove all assets, and then add new ones one by one
        await chapter.removeAssets()

        assets.sort((a, b) => a.indexInParentChapter - b.indexInParentChapter)

        for (const asset of assets) {
            const assetObj = await Asset.findOne({where: {id: asset.id}})
            assetObj.setChapter(chapter)
            await chapter.addAsset(assetObj, {through: {indexInParentChapter: asset.indexInParentChapter}})
        }

        let upadtedChapter = await Chapter.findOne({where: {id: chapterId}});
        // let updatedAssets = JSON.parse(JSON.stringify(await upadtedChapter.getAssets()));
        // console.log(`after update`,  updatedAssets)

        returnData = {status: "ok", data: {chapter: upadtedChapter}}
    }

    if(params.reason === 'delete'){
        const {postId} = jsonres

        await Post.destroy({where: {id: postId}})
        await Chapter.destroy({where: {postId}})
    }




    return new Response(
        JSON.stringify(returnData),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}