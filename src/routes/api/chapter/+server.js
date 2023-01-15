import {getChapter} from "$lib/api/server/controler.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }){
    let postId = url.searchParams.get("id")

    let index = url.searchParams.get("index")

    index = index ? index : 0

    let chapter = getChapter(postId, index)

    return new Response( JSON.stringify(chapter),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}