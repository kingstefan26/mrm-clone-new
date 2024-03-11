import { error, json, redirect } from '@sveltejs/kit';
import * as DB from '$lib/api/server/db.js';
import { getHash } from '$lib/sha.js';
import { TokenGenerator } from '$lib/api/server/controlers/TokenUtil.js';

/** @type {import("../../../../../../../.svelte-kit/types/src/routes").RequestHandler} */
export async function POST({ request, cookies }) {
	await new Promise((resolve) => setTimeout(resolve, 3000));

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
		const token = new TokenGenerator('a', 'a', {
			algorithm: 'HS256',
			keyid: '1',
			noTimestamp: false,
			expiresIn: '10d',
			notBefore: '0'
		}).sign(
			{
				username: user.username,
				id: user.id,
				admin: user.admin
			},
			{
				audience: 'myaud',
				issuer: 'mrm-main-server',
				jwtid: '1',
				subject: 'user'
			}
		);
		cookies.set('jwt', token, { path: '/' });
		redirect(307, '/admin');
	} else {
		error(401, 'Invalid Hash');
	}

	return json({});
}
