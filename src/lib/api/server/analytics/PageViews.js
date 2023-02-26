import { View } from '$lib/api/server/db.ts';

export async function logView(postId, chapterId) {
	if (postId === undefined || chapterId === undefined) {
		console.error('logView: postId and chapterId must be defined');
	} else {
		await View.create({
			postId,
			chapterId
		});
	}
}
