import { getChapterWithPost } from '$lib/api/server/controler.js';
import { error } from '@sveltejs/kit';
import { Post } from '$lib/api/server/db.js';

/** @type {import("./$types").Load} */
export async function load({ params, locals }) {
	const chapterIndex = Number.parseInt(params.chapter || '0');

	// const postDataForReader = await getPostDataForReader(params.title, chapterIndex);

	// catch errors
	let postDataForReader;
	try {
		const postId = params.title;
		const chapter = chapterIndex;

		const post = await getChapterWithPost(postId, chapter);

		if (!post || !post.published) {
			error(404, `Post ${postId} at chapter ${chapter} not found`);
		}
		post.chapters = post.chapters.filter((chapter) => chapter.published);

		if (post.chapters.length === 0) {
			error(404, `Could not find chapter ${chapter} in post ${postId}`);
		}

		const languages = new Set();
		post.chapters.forEach((chapter) => {
			chapter.assets.forEach((asset) => {
				asset.versions.forEach((version) => {
					languages.add(version.lang);
				});
			});
		});

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

		postDataForReader = post;
	} catch (exeption) {
		throw error(404, 'cant find post');
	}

	return {
		current_chapter: chapterIndex,
		post: postDataForReader,
		admin: !!(locals.user && locals.user.admin),
		reader: params.readerOpt === 'reader'
	};
}
