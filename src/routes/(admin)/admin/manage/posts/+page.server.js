import {error} from "@sveltejs/kit";
import {getFeed} from "$lib/api/server/controler.js";

/** @type {import('./$types').Load} */
export async function load() {
    let feed = getFeed(0, 10);

    if (feed.posts.length === 0) {
        throw error(404, {
            message: "No posts found"
        })
    }

    // the test post!!!
    // const feed1 = {
    //     posts: []
    // }
    //
    // for (let i = 0; i < feed.posts.length; i++) {
    //     if(feed.posts[i].id === 'Testing story'){
    //         feed1.posts.push(feed.posts[i])
    //         feed1.posts.push(feed.posts[i])
    //         feed1.posts.push(feed.posts[i])
    //     }
    // }
    //
    // feed = feed1

    return {
        feed
    }

}