import SearchIndex from "$lib/api/server/search/SearchIndex.js";

export async function GET({locals, request, params, url}) {
    // if (!locals.user.admin) {
    //     return new Response(
    //         JSON.stringify({status: "error", message: "You are not logged in"}),
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         }
    //     )
    // }


    const limit = url.searchParams.get("limit")

    const query = url.searchParams.get("query")

    let returnData = {
        status: "ok",
        data: await SearchIndex.search(query, {limit: limit ? limit : 10})
    }


    return new Response(
        JSON.stringify(returnData),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}
