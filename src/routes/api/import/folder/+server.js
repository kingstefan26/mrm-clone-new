import { Chapter, Post } from '$lib/api/server/db.js';
import { chapterAssetsFromFormData } from '$lib/api/server/import.js';
import { getStubAutor } from '$lib/api/server/controler.js';
import { json } from '@sveltejs/kit';
import * as DB from '$lib/api/server/db.js';
import {protectEndpoint} from '$lib/util.js';

export async function POST({ locals, request }) {
	let a = protectEndpoint(locals)
	if(a) {
		return a
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

	await chapter.setPost(post);

	post.chapterCount = await DB.Chapter.count({
		where: {
			postId: post.id
		}
	});

	await post.save();

	// read form data from request
	const formData = await request.formData();

	await chapterAssetsFromFormData(chapter, formData, post);

	return json({ status: 'ok', data: { id: id } });
}
