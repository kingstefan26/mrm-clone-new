import { error } from '@sveltejs/kit';
import { getChapter, getPost } from "$lib/api/client/util.js";

/** @type {import('./$types').Load} */
export async function load({params, fetch}) {
    const chapterIndex = params.chapter ? Number.parseInt(params.chapter) : 0
    const postId = params.title

    const post = await getPost(postId, fetch)

    if (!post) {
        throw error(404, "Could not find this post");
    }

    const { chapter } = await getChapter(postId, chapterIndex, fetch)

    chapter.chapter_media.forEach(mediaElement => {
        mediaElement.path = mediaElement.path.startsWith("http") ? mediaElement.path : "/asset" + mediaElement.path
    })

    return {
        current_chapter: chapterIndex,
        chapter,
        meta: post
    }
}