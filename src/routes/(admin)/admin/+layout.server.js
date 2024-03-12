import { Post, View } from '$lib/api/server/db.js';
import { Op } from 'sequelize';

/** @type {import('./$types').LayoutServerLoad}
 * @return {Promise<{
 *   user: ({
 *   username: string;
 *   email: string;
 *   image: string;
 *   }|undefined);
 *   postCount: number;
 *   viewCount: number;
 * }>}
 * */
export async function load({ locals }) {
	if (!locals.user) {
		return {
			user: undefined,
			postCount: 0,
			viewCount: 0
		};
	}

	const postCount = await Post.count({
		where: {
			published: true
		}
	});

	const viewCount = await View.count({
		where: {
			createdAt: {
				[Op.gt]: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
			}
		}
	});

	return {
		user: locals.user && {
			username: locals.user.username,
			email: locals.user.email,
			image: locals.user.image
		},
		postCount,
		viewCount
	};
}
