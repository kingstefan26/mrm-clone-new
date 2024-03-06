import { fail, redirect } from '@sveltejs/kit';
import * as DB from '$lib/api/server/db.js';
import { getHash } from '$lib/sha.js';
import { TokenGenerator } from '$lib/api/server/controlers/TokenUtil.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (locals.user && locals.user.admin) {
		redirect(307, '/admin');
	}
}

async function authenticateUser(email, passwrd) {
	const user = await DB.User.findOne({
		where: {
			email: email
		}
	});

	if (user === null) {
		return undefined;
	}

	const hash = await getHash(user.salt + passwrd);
	console.log(`calculated hash: ${hash}, expected hash: ${user.passHash}`);
	if (hash === user.passHash) {
		return new TokenGenerator('a', 'a', {
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
	}

	return undefined;
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();

		let token = await authenticateUser(formData.get('email'), formData.get('password'));

		if (!token) {
			console.log('login failed');
			return fail(401);
		} else {
			cookies.set('jwt', token, { path: '/' });
			redirect(307, '/admin');
		}
	}
};
