import { error } from '@sveltejs/kit';
import { getFeed } from '$lib/api/server/controler.js';
import { User } from '$lib/api/server/db.ts';

/** @type {import('./$types').Load} */
export async function load() {
	const users = await User.findAll();

	if (users.length === 0) {
		throw error(404, {
			message: 'No users found'
		});
	}

	return { users: JSON.parse(JSON.stringify(users)) };
}
