import * as path from 'path';
import * as fs from 'fs';
import { Asset, AssetBucket, Chapter, Post } from '$lib/api/server/db.ts';

// unzip the buffer
import unzip from 'unzipper';
import { addChapterToPost } from '$lib/api/server/controlers/ChapterController.js';
import { createAssetVersion } from '$lib/api/server/assets/AssetVersionManager.ts';

export async function POST({ locals, request }) {
	if (!locals.user.admin) {
		return new Response(JSON.stringify({ status: 'error', message: 'You are not logged in' }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	// create 'upload' dir if it doesn't exist
	const uploadDir = path.join(process.cwd(), 'upload');

	// make sure dir exists
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir);
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

	// id is the title with only lowercase letters and numbers
	let id = title.toLowerCase().replace(/[^a-z0-9]/g, '');

	// check if with the given id already exists
	let exisitngPost = await Post.findOne({
		where: {
			id: id
		}
	});
	// if it does, add a random number to the end
	if (exisitngPost) {
		id += Math.floor(Math.random() * 1000);
	}

	// create a Post from meta.title
	const post = await Post.create({
		title: title,
		id: id,
		published: false
	});

	// create a chapter
	const chapter = await Chapter.create({
		name: 'number One',
		published: false,
		indexInParentPost: 0
	});

	// add the chapter to the post
	await addChapterToPost(post, chapter);

	const assetbucket = await AssetBucket.create({
		snowflake: `${id}-${chapter.indexInParentPost}-assets`
	});

	// get the assets list
	const assetList = meta.images;
	// iterate, and create AssetVersion for each with the assets from the zip
	for (let i = 0; i < assetList.length; i++) {
		// in the zip files get the one that file name matches i, eg if i=12 then we look for files that filename is 12 without the file extension
		const assetFile = files.find((file) => {
			// extract the file name without the extension from the path
			const fileName = file.path.split('.').slice(0, -1).join('.');
			// return true if the file name matches the index
			return fileName === i.toString();
		});
		// get the buffer from the file
		const assetBuffer = await assetFile.buffer();

		const version = await createAssetVersion(assetBuffer, 'en', true);

		const asset = await Asset.create({ indexInChapter: i });
		await asset.addAssetData(version);
		await asset.setAssetBucket(assetbucket);

		if (i === 0) {
			post.posterAssetId = asset.id;
			await post.save();
		}

		await asset.setChapter(chapter);
	}

	return new Response(JSON.stringify({ status: 'ok', data: { id: post.id } }), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
