import {getFeed} from "$lib/api/server/controler.js";

export async function GET({ url }){
    let pageIndex = url.searchParams.get("page")

    pageIndex = pageIndex ? pageIndex : 0

    return new Response(
        JSON.stringify(getFeed(pageIndex)),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}