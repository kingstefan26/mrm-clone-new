import { View } from '$lib/api/server/db.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { postId, chapterIndex, type } = await request.json();
	if (!postId || !type) {
		return json({ status: 'error', message: 'missing postid or chapterIndex' });
	}
	if (type === 'view') {
		// log the view
		if (chapterIndex === undefined) {
			console.error('logView: postId and chapterId must be defined');
		} else {
			await View.create({
				postId,
				chapterIndex
			});
		}
	}

	return json({ status: 'ok' });
}
