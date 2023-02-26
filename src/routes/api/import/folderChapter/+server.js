import { Post } from '$lib/api/server/db.ts';
import { createNextChapter } from '$lib/api/server/controlers/ChapterController.js';
import { chapterAssetsFromFormData } from '$lib/api/server/import.js';

export async function POST({ locals, request }) {
	if (!locals.user.admin) {
		return new Response(JSON.stringify({ status: 'error', message: 'You are not logged in' }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	// read form data from request
	const formData = await request.formData();

	const post = await Post.findOne({
		where: {
			id: formData.get('postId')
		}
	});

	const chapter = await createNextChapter(post);

	await chapterAssetsFromFormData(chapter, formData, post);

	return new Response(
		JSON.stringify({ status: 'ok', data: { indexInParentPost: chapter.indexInParentPost } }),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}
