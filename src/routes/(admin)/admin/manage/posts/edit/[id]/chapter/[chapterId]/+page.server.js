import { error } from '@sveltejs/kit';
import { Chapter } from '$lib/api/server/db.js';
import { Asset } from '$lib/api/server/db.js';

/** @type {import("./$types").Load} */
export async function load({ params }) {
	let chapter = await Chapter.findOne({
		where: {
			postId: params.id,
			indexInParentPost: params.chapterId
		},
		include: [Asset]
	});

	if (!chapter) {
		return error(404, 'Chapter not found');
	}

	chapter = JSON.parse(JSON.stringify(chapter));

	chapter.assets.sort((a, b) => a.indexInParentChapter - b.indexInParentChapter);

	return {
		chapter
	};
}
