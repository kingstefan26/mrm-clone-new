import { getPostDataForReader } from '$lib/api/server/controler.js';

/** @type {import("./$types").Load} */
export async function load({ params, locals }) {
	const chapterIndex = Number.parseInt(params.chapter || '0');
	return {
		current_chapter: chapterIndex,
		post: await getPostDataForReader(params.title, chapterIndex),
		admin: !!(locals.user && locals.user.admin)
	};
}
