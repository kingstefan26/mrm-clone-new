import {Author, Genere, Series} from "$lib/api/server/db.js";

export async function GET({locals, request, params, url}) {
    if (!locals.user.admin) {
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

    if (params.reason === "authors") {
        let limit = url.searchParams.get("limit")
        if (!limit) {
            limit = 100
        }

        const artists = await Author.findAll({
            limit: limit
        })
        returnData.data = artists.map(artist => {
            return {
                longName: artist.longName,
                name: artist.name
            }
        })
    }

    if (params.reason === "author") {
        const name = url.searchParams.get("name")
        if (!name) {
            returnData = {status: "error", message: "No name provided"}
        } else {
            const artist = await Author.findOne({
                where: {
                    name: name
                }
            })
            returnData.data = {name: artist.name, longName: artist.longName, id: artist.id}
        }
    }

    if (params.reason === "series") {
        const series = await Series.findAll()
        returnData.data = series.map(serie => serie.name)
    }

    if (params.reason === "generes") {
        const generes = await Genere.findAll()
        returnData.data = generes.map(genre => genre.name)
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
