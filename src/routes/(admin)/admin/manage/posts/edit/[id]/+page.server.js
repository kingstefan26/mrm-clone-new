import { getChapterWithPost } from '$lib/api/server/controler.js';

/** @type {import("./$types").Load} */
export async function load({ params }) {
	try {
		const post = await getChapterWithPost(params.id, -1);
		return {
			post
		};
	} catch (error) {
		console.log(error);
		error(404, {
			message: 'Post not found'
		});
	}
}
