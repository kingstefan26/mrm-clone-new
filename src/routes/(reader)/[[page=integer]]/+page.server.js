import {Post} from '$lib/api/server/db.js';
import { Author, paginate } from '$lib/api/server/db.js';

async function getFeed(pageIndex = 0, pageSize = 10) {
	let { count, rows } = await Post.findAndCountAll(
		paginate(
			{
				offset: pageIndex * pageSize,
				limit: pageSize,
				where: { published: true },
				include: [Author]
			},
			{
				page: pageIndex,
				pageSize
			}
		)
	);

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

/** @type {import("./$types").Load} */
export async function load({ params }) {
	return {
		stream: {
			feed: getFeed(params.page || 0, 10)
		}
	};
}
