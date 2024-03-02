import { Chapter, Post } from '$lib/api/server/db.js';
import { chapterAssetsFromFormData } from '$lib/api/server/import.js';
import { json } from '@sveltejs/kit';
import * as DB from '$lib/api/server/db.js';

export async function POST({ locals, request }) {
	if (!locals.user.admin) {
		return json({ status: 'error', message: 'You are not logged in' });
	}

	// read form data from request
	const formData = await request.formData();

	const post = await Post.findOne({
		where: {
			id: formData.get('postId')
		}
	});

	const chapterCount = await Chapter.count({ where: { postId: post.id } });

	let nextChapterIndex = chapterCount;

	const chapter = await Chapter.create({
		name: `${nextChapterIndex}`,
		published: false,
		indexInParentPost: nextChapterIndex
	});

	await chapter.setPost(post);

	post.chapterCount = await DB.Chapter.count({
		where: {
			postId: post.id
		}
	});

	await post.save();

	console.log(`created chapter ${chapter.id} for post ${post.id} with name ${chapter.name}`);

	await chapterAssetsFromFormData(chapter, formData, post);

	return json({ status: 'ok', data: { indexInParentPost: chapter.indexInParentPost } });
}
