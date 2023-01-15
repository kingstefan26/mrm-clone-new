import { getPost } from "$lib/api/server/controler.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }){
    let postId = url.searchParams.get("id")

    let post = getPost(postId)

    return new Response( JSON.stringify(post),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}