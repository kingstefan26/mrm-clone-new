import { error } from '@sveltejs/kit';
import { getFeed } from '$lib/api/server/controler.js';

/** @type {import("./$types").Load} */
export async function load() {
	let feed = await getFeed(0, 10, true);

	if (feed.posts.length === 0) {
		error(404, {
        			message: 'No posts found'
        		});
	}

	return { feed };
}
