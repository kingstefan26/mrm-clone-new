import { User } from '$lib/api/server/db.js';
import { error, json } from '@sveltejs/kit';
import { Op } from 'sequelize';

export async function POST({ request }) {
	const { username } = await request.json();
	if (!username) {
		error(400, 'Provide a username');
	}
	console.log(username);
	const user = await User.findOne({
		where: { [Op.or]: [{ email: username }, { username: username }] }
	});
	if (!user) {
		error(404, `No such user`);
	}

	const hasPasskeys = (await user.getPasskeyCredentials()).length !== 0;

	return json({
		hasPasskeys
	});
}
