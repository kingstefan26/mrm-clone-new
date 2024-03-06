import { redirect } from '@sveltejs/kit';
import { Post, View } from '$lib/api/server/db.js';
import { Op } from 'sequelize';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {
	if ((!locals.user || !locals.user.username) && url.pathname !== '/admin/login') {
		redirect(307, '/admin/login');
	}

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
