import {Author, Series} from "$lib/api/server/db.js";

export async function GET({locals, request, params}) {
    if(!locals.user.admin) {
        return new Response(
            JSON.stringify({status: "error", message: "You are not logged in"}),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    }

    let returnData = {status: "ok"}

    if(params.reason === "authors") {
        const artists = await Author.findAll()
        returnData.data = artists.map(artist => artist.name)
    }

    if(params.reason === "series") {
        const series = await Series.findAll()
        returnData.data = series.map(serie => serie.name)
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
