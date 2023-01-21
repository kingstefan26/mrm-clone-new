import { error } from '@sveltejs/kit';
import {getChapter, getPost} from "$lib/api/server/controler.js";

/** @type {import('./$types').Load} */
export async function load({params}) {
    const chapterIndex = params.chapter ? Number.parseInt(params.chapter) : 0
    const postId = params.title

    const post = await getPost(params.title)

    if (!post) {
        throw error(404, "Could not find this post");
    }

    const { chapter } = await getChapter(postId, chapterIndex)

    chapter.chapter_media.forEach(mediaElement => {
        mediaElement.path = mediaElement.path.startsWith("http") ? mediaElement.path :  mediaElement.path
    })

    return {
        current_chapter: chapterIndex,
        chapter,
        meta: post
    }
}