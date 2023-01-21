import {error} from "@sveltejs/kit";
import {getFeed} from "$lib/api/server/controler.js";

/** @type {import('./$types').Load} */
export async function load({params}) {

    let feed = await getFeed(params.page)

    if(feed.posts.length === 0){
        throw error(404, {
            message: "No posts found"
        })
    }

    return {
        feed
    }

}