import * as DB from '$lib/api/server/db.js';
import {
	Asset,
	AssetBucket,
	AssetVersion,
	Author,
	Category,
	Genere,
	Pairing,
	Post,
	Scanlination,
	Series,
	Status,
	Tag
} from '$lib/api/server/db.js';

export async function getStubAutor() {
	let author = await Author.findOne({
		where: {
			name: 'Nobody'
		}
	});
	if (!author) {
		author = await Author.create({
			name: 'Nobody'
		});
	}
	return author;
}

export async function getFeed(pageIndex = 0, pageSize = 10, showUnpublishedPosts = false) {
	let where = { published: true };

	if (showUnpublishedPosts) {
		where = {};
	}

	let { count, rows } = await DB.Post.findAndCountAll({
		offset: pageIndex * pageSize,
		limit: pageSize,
		where: where,
		include: [Author]
	});

	if (typeof rows !== 'undefined' && rows.length === 0) {
		return {
			posts: [],
			pagesAvalible: 0
		};
	}

	rows = rows.map((s) => {
		return {
			title: s.title,
			id: s.id,
			posterAssetId: s.posterAssetId,
			Author: {
				name: s.Author.name
			}
		};
	});

	if (rows.length === 0) {
		throw new Error('No posts found');
	}

	return {
		posts: rows,
		pagesAvalible: Math.ceil(count / pageSize)
	};
}

// chapterIndex -1 means we get all the chapters
export async function getChapterWithPost(postId = '', chapterIndex = 0) {
	let post = await Post.findOne({
		where: {
			id: postId
		},
		include: [Author, Category, Genere, Pairing, Scanlination, Tag, Status, Series]
	});

	if (!post) {
		throw new Error(`Post ${postId} not found`);
	}

	// get poster assets and attach it
	let posterAsset = await Asset.findOne({
		where: {
			id: post.posterAssetId
		},
		include: [AssetVersion]
	});

	let postData = {
		...post.get({ plain: true }),
		posterAsset: posterAsset.get({ plain: true })
	};

	let postChapters;

	if (chapterIndex === -1) {
		postChapters = await post.getChapters();
	} else {
		postChapters = await post.getChapters({
			where: {
				indexInParentPost: chapterIndex
			}
		});
	}

	postData.chapters = [];

	postData.assetBuckets = [];

	// usually this only goes through once,
	// since the reader only requests one chapter at a time
	for (const chapterElement of postChapters) {
		let chapter = chapterElement;
		// console.time('getChapterAssets');
		let assets = await chapter.getAssets({
			include: [AssetVersion]
		});

		for (let i = 0; i < assets.length; i++) {
			const asset = assets[i];

			const versions = [];
			for (let j = 0; j < asset.assetData.length; j++) {
				const version = asset.assetData[j];
				versions.push(version.get({ plain: true }));
			}

			assets[i] = {
				...asset.get({ plain: true }),
				versions
			};
		}

		postData.chapters.push({
			...chapter.get({ plain: true }),
			assets
		});

		const bucket = await AssetBucket.findOne({
			where: {
				snowflake: `${postId}-${chapter.indexInParentPost}-assets`
			}
		});

		if (!bucket) {
			throw new Error(`Bucket "${postId}-${chapter.indexInParentPost}-assets" not found`);
		}

		postData.assetBuckets.push(bucket.get({ plain: true }));
	}

	if (postData.chapters.length === 0) {
		console.error(`chapter ${chapterIndex} not found in post ${postId}`);
	}

	return postData;
}
