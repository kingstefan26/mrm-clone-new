import { error } from '@sveltejs/kit';
import { getChapterWithPost } from '$lib/api/server/controler.js';

/** @type {import("./$types").Load} */
export async function load({ params }) {
	const post = await getChapterWithPost(params.id, -1);

	if (!post) {
		throw error(404, {
			message: 'Post not found'
		});
	}

	return {
		post
	};
}
