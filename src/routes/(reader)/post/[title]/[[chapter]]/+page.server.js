import {getChapterWithPost} from "$lib/api/server/controler.js";
import {error} from "@sveltejs/kit";
import {View} from "$lib/api/server/db.js";

/** @type {import('./$types').Load} */
export async function load({params}) {
    const chapterIndex = params.chapter ? Number.parseInt(params.chapter) : 0
    const postId = params.title

    const post = await getChapterWithPost(postId, chapterIndex)
    if(!post || !post.published){
        throw error(404, `Post ${postId} at chapter ${chapterIndex} not found`)
    }
    // delete chapters that are not pulbished
    post.chapters = post.chapters.filter(chapter => chapter.published)


    if(post.chapters.length === 0){
        throw error(404, `Could not find chapter ${chapterIndex} in post ${postId}`)
    }

    post.chapters = post.chapters.map(chapter => {
        chapter.assets = chapter.assets.map(asset => {
            return {
                width: asset.versions[0].width,
                height: asset.versions[0].height,
                lang: asset.versions[0].lang,
                id: asset.id,
                indexInChapter: asset.indexInChapter,
            }
        })
        return chapter
    })

    View.create({
        postId: postId,
        chapterId: post.chapters[0].id
    })

    console.log("post", post)

    return {
        current_chapter: chapterIndex,
        post
    }
}