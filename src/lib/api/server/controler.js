import { TokenGenerator } from '$lib/api/server/token-util.js';
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

export async function getPostDataForReader(postId = '', chapter = 0) {
	if (!postId) return {};

	const post = await getChapterWithPost(postId, chapter);
	if (!post || !post.published) {
		throw new Error(`Post ${postId} at chapter ${chapter} not found`);
	}
	// delete chapters that are not pulbished
	post.chapters = post.chapters.filter((chapter) => chapter.published);

	if (post.chapters.length === 0) {
		throw new Error(`Could not find chapter ${chapter} in post ${postId}`);
	}

	// find unique languages
	const languages = new Set();
	post.chapters.forEach((chapter) => {
		chapter.assets.forEach((asset) => {
			asset.versions.forEach((version) => {
				languages.add(version.lang);
			});
		});
	});

	// create a available languages array
	post.languages = [];
	languages.forEach((lang) => {
		post.languages.push(lang);
	});

	post.chapters = post.chapters.map((chapter) => {
		chapter.assets = chapter.assets.map((asset) => {
			return {
				id: asset.id,
				indexInChapter: asset.indexInChapter,
				width: asset.versions[0].width,
				height: asset.versions[0].height
			};
		});
		return {
			indexInParentPost: chapter.indexInParentPost,
			name: chapter.name,
			assets: chapter.assets,
			sensitiveContent: chapter.sensitiveContent,
			western: chapter.western
		};
	});

	let seriesCount = 0;
	let seriesLinks = [{}];
	if (post.seriesId) {
		const seriesPosts = await Post.findAll({ where: { seriesId: post.seriesId } });
		seriesCount = seriesPosts.length;
		seriesLinks = seriesPosts.map((post) => {
			return {
				id: post.id
			};
		});
	}

	post.seriesCount = seriesCount;
	post.seriesLinks = seriesLinks;

	return post;
}

export async function getStubAutor() {
	let autor = await Author.findOne({
		where: {
			name: 'Nobody'
		}
	});
	if (!autor) {
		autor = await Author.create({
			name: 'Nobody'
		});
	}
	return autor;
}

export async function getFeed(pageIndex = 0, pageSize = 10, showUnpublishedPosts = false) {
	let where = { published: true };

	if (showUnpublishedPosts) {
		where = {};
	}

	let { count, rows } = await DB.Post.findAndCountAll({
		offset: pageIndex * pageSize,
		limit: pageSize,
		where: where
	});

	if (typeof rows !== 'undefined' && rows.length === 0) {
		return {
			posts: [],
			pagesAvalible: 0
		};
	}

	rows = rows.map((s) => JSON.parse(JSON.stringify(s)));

	return {
		posts: rows,
		pagesAvalible: Math.ceil(count / pageSize)
	};
}

// chapterIndex -1 means we get all the chapters
export async function getChapterWithPost(postId = '', chapterIndex = 0) {
	let { post, posterAsset } = await getPostPopulated(postId);
	if (!post) return undefined;

	let postData = post.get({ plain: true });

	postData.posterAsset = posterAsset.get({ plain: true });

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

	for (const chapterElement of postChapters) {
		let chapter = chapterElement;
		let assets = await chapter.getAssets();

		assets = await Promise.all(
			assets.map(async (asset) => {
				const assetData = asset.get({ plain: true });
				const versions = await asset.getAssetData();

				assetData.versions = versions.map((version) => version.get({ plain: true }));

				return assetData;
			})
		);

		const chapterData = chapter.get({ plain: true });
		chapterData.assets = assets;
		postData.chapters.push(chapterData);

		let snowflake = `${postId}-${chapter.indexInParentPost}-assets`;
		const bucket = await AssetBucket.findOne({
			where: {
				snowflake: snowflake
			}
		});
		if (bucket) {
			postData.assetBuckets.push(bucket.get({ plain: true }));
		}
	}

	if (postData.chapters.length === 0) {
		console.error(`chapter ${chapterIndex} not found in post ${postId}`);
	}

	return postData;
}

export async function getTag(name = '') {
	let tag = await Tag.findOne({
		where: {
			name: name
		}
	});

	if (!tag) {
		tag = await Tag.create({
			name: name
		});
	}

	return tag;
}

export async function getChapterWithAssets(postId = '', chapterIndex = 0) {
	const chapter = await DB.Chapter.findOne({
		where: {
			postId: postId,
			indexInParentPost: chapterIndex
		},
		include: [Asset]
	});

	return chapter ? JSON.parse(JSON.stringify(chapter)) : undefined;
}

export async function getPostPopulated(postId = '') {
	let post = await Post.findOne({
		where: {
			id: postId
		},
		include: [Author, Category, Genere, Pairing, Scanlination, Tag, Status, Series]
	});

	if (!post) {
		return undefined;
	}

	// get poster assets and attach it
	let posterAsset = await Asset.findOne({
		where: {
			id: post.posterAssetId
		},
		include: [AssetVersion]
	});

	return { post, posterAsset };
}
