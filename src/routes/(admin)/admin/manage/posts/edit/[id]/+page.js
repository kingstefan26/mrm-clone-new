import { error } from '@sveltejs/kit';
import { getChapter, getPost } from "$lib/api/client/util.js";

/** @type {import('./$types').Load} */
export async function load({params, fetch}) {
    const post = await getPost(params.id, fetch)

    let chapters = []
    for (let i = 0; i < post.chapter_count; i++) {
        chapters[i] = await getChapter(params.id, i, fetch)
    }

    console.log(chapters)
    if (!post) {
        throw error(404, "Could not find this post");
    }

    return {
        post,
        chapters
    }
}