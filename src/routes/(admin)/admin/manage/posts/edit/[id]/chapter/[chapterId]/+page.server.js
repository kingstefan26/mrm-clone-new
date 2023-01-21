import { error } from '@sveltejs/kit';
import {getChapter} from "$lib/api/server/controler.js";

/** @type {import('./$types').Load} */
export async function load({params}) {
    const chapter = await getChapter(params.id, params.chapterId)
    console.log(chapter)
    if (!chapter || Object.keys(chapter).length === 0) {
        throw error(404, "Invalid Chapter");
    }

    return {
        chapter,
        postId: params.id
    }
}