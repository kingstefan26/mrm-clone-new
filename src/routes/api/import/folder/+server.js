import { Chapter, Post } from '$lib/api/server/db.ts';
import { addChapterToPost } from '$lib/api/server/controlers/ChapterController.js';
import { chapterAssetsFromFormData } from '$lib/api/server/import.js';
import { getStubAutor } from '$lib/api/server/controler.js';

export async function POST({ locals, request }) {
	if (!locals.user.admin) {
		return new Response(JSON.stringify({ status: 'error', message: 'You are not logged in' }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	// create stub title
	const title = 'stub title';
	// generate radom uuid as the id
	const id =
		Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

	// create a Post from meta.title
	const post = await Post.create({
		title: title,
		id: id,
		published: false
	});

	await post.setAuthor(await getStubAutor());

	// create a chapter
	const chapter = await Chapter.create({
		name: 'number One',
		published: true,
		indexInParentPost: 0
	});

	await addChapterToPost(post, chapter);

	// read form data from request
	const formData = await request.formData();

	await chapterAssetsFromFormData(chapter, formData, post);

	return new Response(JSON.stringify({ status: 'ok', data: { id: id } }), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
