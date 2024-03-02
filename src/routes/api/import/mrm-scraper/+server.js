import { Chapter, Post } from '$lib/api/server/db.js';

// unzip the buffer
import unzip from 'unzipper';
import { getStubAutor } from '$lib/api/server/controler.js';
import { chapterAssetsFromFormData } from '$lib/api/server/import.js';
import mime from 'mime-kind';
import { json } from '@sveltejs/kit';
import * as DB from '$lib/api/server/db.js';

export async function POST({ locals, request }) {
	if (!locals.user.admin) {
		return json({ status: 'error', message: 'You are not logged in' });
	}

	// read form data from request
	const formData = await request.formData();

	// get the file from the form data
	const fileFromFrom = formData.get('file');

	// get the buffer from the file
	const buffer = await fileFromFrom.arrayBuffer();

	// turn buffer to unit8array
	const uint8Array = new Uint8Array(buffer);

	const unzipBuffer = await unzip.Open.buffer(uint8Array);
	// get files
	const files = unzipBuffer.files;
	// get meta.json
	const metaFile = files.find((file) => file.path === 'meta.json');
	// read meta.json
	const meta = JSON.parse(await metaFile.buffer());

	const title = meta.title;

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

	// add the chapter to the post
	await chapter.setPost(post);

	post.chapterCount = await DB.Chapter.count({
		where: {
			postId: post.id
		}
	});

	await post.save();

	const newFormData = new FormData();
	const assetList = meta.images;
	for (let i = 0; i < assetList.length; i++) {
		// in the zip files get the one that file name matches i, eg if i=12 then we look for files that filename is 12 without the file extension
		const assetFile = files.find((file) => {
			// extract the file name without the extension from the path
			const fileName = file.path.split('.').slice(0, -1).join('.');
			// return true if the file name matches the index
			return fileName === i.toString();
		});
		const arrayBuffer = await assetFile.buffer();
		const blob = new Blob([arrayBuffer], { type: (await mime(arrayBuffer)).mime });
		console.log(i.toString(), blob, assetFile.path);
		// get the buffer from the file
		newFormData.append(i.toString(), blob, assetFile.path);
	}

	await chapterAssetsFromFormData(chapter, newFormData, post);

	return json({ status: 'ok', data: { id: post.id } });
}
