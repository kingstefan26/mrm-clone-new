import {getFeedPage} from "$lib/api/client/util.js";
import {error} from "@sveltejs/kit";

/** @type {import('./$types').Load} */
export async function load({fetch, params}) {
    let feed = await getFeedPage(params.page, fetch);

    console.log(feed)
    if(feed.posts.length === 0){
        throw error(404, {
            message: "No posts found"
        })
    }

    return {
        feed
    }

}