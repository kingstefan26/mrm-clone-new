import { error } from '@sveltejs/kit';
import * as DB from '$lib/api/server/db.js';
import { Author, paginate } from '$lib/api/server/db.js';

const pageSize = 20;

/** @type {import("./$types").Load} */
export async function load() {
	const { count, rows } = await DB.Post.findAndCountAll(
		paginate(
			{
				include: [Author]
			},
			{ page: 0, pageSize }
		)
	);

	const posts = rows.map((s) => {
		return s.get({ plain: true });
	});

	return {
		posts: posts,
		totalPages: Math.ceil(count / pageSize)
	};
}
