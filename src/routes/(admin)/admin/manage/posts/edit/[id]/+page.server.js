import { error } from '@sveltejs/kit';
import {getChapterWithPost} from "$lib/api/server/controler.js";

/** @type {import('./$types').Load} */
export async function load({params}) {

    const post = await getChapterWithPost(params.id, -1)

    return {
        post
    }
}