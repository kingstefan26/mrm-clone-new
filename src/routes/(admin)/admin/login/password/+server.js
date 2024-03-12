import { error, json, redirect } from '@sveltejs/kit';
import * as DB from '$lib/api/server/db.js';
import { getHash } from '$lib/sha.js';
import { TokenGenerator } from '$lib/api/server/controlers/TokenUtil.js';
import { saveSessionInJWT } from '../../../../../hooks.server';

/** @type {import("$types").RequestHandler} */
export async function POST({ request, cookies, locals }) {
	const { email, password } = await request.json();

	if (!email) {
		error(400, 'No email');
	}

	const passHash = password;
	if (!passHash) {
		error(400, 'No Password Hash');
	}

	console.log('email', email);
	console.log('pass', passHash);

	const user = await DB.User.findOne({
		where: {
			email
		}
	});

	if (!user) {
		error(400, 'No such user');
	}

	const hash = await getHash(user.salt + passHash);

	if (hash === user.passHash) {
		saveSessionInJWT(user, locals, cookies)
		redirect(307, '/admin');
	} else {
		error(401, 'Invalid Hash');
	}

	return json({});
}
