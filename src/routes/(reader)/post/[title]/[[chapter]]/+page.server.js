import {getChapterWithPost} from "$lib/api/server/controler.js";
import {error} from "@sveltejs/kit";
import {View} from "$lib/api/server/db.js";

/** @type {import('./$types').Load} */
export async function load({params}) {
    const chapterIndex = params.chapter ? Number.parseInt(params.chapter) : 0
    const postId = params.title

    const post = await getChapterWithPost(postId, chapterIndex)
    if (!post || !post.published) {
        throw error(404, `Post ${postId} at chapter ${chapterIndex} not found`)
    }
    // delete chapters that are not pulbished
    post.chapters = post.chapters.filter(chapter => chapter.published)


    if (post.chapters.length === 0) {
        throw error(404, `Could not find chapter ${chapterIndex} in post ${postId}`)
    }


    // find unique languages
    const languages = new Set()
    post.chapters.forEach(chapter => {
        chapter.assets.forEach(asset => {
            asset.versions.forEach(version => {
                languages.add(version.lang)
            })
        })
    })

    // create a available languages array
    post.languages = []
    languages.forEach(lang => {
        post.languages.push(lang)
    })


    post.chapters = post.chapters.map(chapter => {
        chapter.assets = chapter.assets.map(asset => {
            return {
                id: asset.id,
                indexInChapter: asset.indexInChapter,
                width: asset.versions[0].width,
                height: asset.versions[0].height,
            }
        })
        return {
            indexInParentPost: chapter.indexInParentPost,
            name: chapter.name,
            assets: chapter.assets,
            sensitiveContent: chapter.sensitiveContent,
            western: chapter.western
        }
    })


    View.create({
        postId: postId,
        chapterId: post.chapters[0].id
    })


    return {
        current_chapter: chapterIndex,
        post
    }
}