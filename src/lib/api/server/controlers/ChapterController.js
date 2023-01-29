import * as DB from "$lib/api/server/db.js";
import {Chapter} from "$lib/api/server/db.js";

export async function addChapterToPost(post, chapter) {
    await chapter.setPost(post)

    post.chapterCount = await DB.Chapter.count({
        where: {
            postId: post.id
        }
    })

    await post.save()
}

export async function createNextChapter(post, name = undefined) {
    const chapterCount = await Chapter.count({where: {postId: post.id}})

    let nextChapterIndex = chapterCount

    if(name === undefined) {
        name = `${nextChapterIndex}`
    }
    const chapter = await Chapter.create({name: name, published: false, indexInParentPost: nextChapterIndex})

    await addChapterToPost(post, chapter)

    console.log(`created chapter ${chapter.id} for post ${post.id} with name ${chapter.name}`)
    return chapter
}