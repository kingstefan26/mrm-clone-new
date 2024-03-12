import * as DB from '$lib/api/server/db.js';
import { Author, paginate } from '$lib/api/server/db.js';
import {protectPage} from '$lib/util.js'

const pageSize = 20;

/** @type {import("./$types").Load} */
export async function load({locals}) {
	protectPage(locals)
	const { count, rows } = await DB.Post.findAndCountAll(
		paginate(
			{
				include: [Author]
			},
			{ page: 0, pageSize }
		)
	);

	return {
		posts: rows.map((s) => {
			return s.get({ plain: true });
		}),
		totalPages: Math.ceil(count / pageSize)
	};
}
