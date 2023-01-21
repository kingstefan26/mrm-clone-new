import { getPostPopulated } from "$lib/api/server/controler.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }){

    let post = await getPostPopulated(params.id)

    return new Response( JSON.stringify(post),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}