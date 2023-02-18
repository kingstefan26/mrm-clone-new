import { getPostDataForReader } from '$lib/api/server/controler.js';
import { error } from '@sveltejs/kit';

/** @type {import("./$types").Load} */
export async function load({ params }) {
	const chapterIndex = params.chapter ? Number.parseInt(params.chapter) : 0;
	const postId = params.title;

	try {
		const post = await getPostDataForReader(postId, chapterIndex);

		return {
			current_chapter: chapterIndex,
			post
		};
	} catch (err) {
		throw error(404, err.message);
	}
}
