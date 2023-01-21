// /src/routes/+page.server.js

import {Post} from '$lib/api/server/db.js'

/** @type {import('./$types').PageServerLoad} */

export async function load() {
    const posts = await Post.findAll()
    const clean = posts.map((s) => JSON.parse(JSON.stringify(s)))

    return { posts: clean}
}
