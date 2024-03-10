import { PasskeyChallenges, User } from '$lib/api/server/db.js';
import { error, json } from '@sveltejs/kit';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { rpId } from '$lib/api/server/passkeys.js';
import { Op } from 'sequelize';

export async function POST({ request, cookies }) {
	const { username } = await request.json();

	const user = await User.findOne({
		where: { [Op.or]: [{ email: username }, { username: username }] }
	});
	if (!user) {
		error(404, `Could not find user with username "${username}"`);
	}
	cookies.set('userid', username, { path: '/' });

	const options = await generateAuthenticationOptions({
		timeout: 60000,
		allowCredentials: [],
		userVerification: 'preferred',
		rpId
	});
	console.log(`creating challenge for the sessionId ${username}: ${options.challenge}`);
	await PasskeyChallenges.create({ challenge: options.challenge, sessionId: username });

	return json(options);
}

// function getMethods(obj) {
// 	const result = [];
// 	for (const id in obj) {
// 		try {
// 			if (typeof obj[id] == 'function') {
// 				result.push(id + ': ' + obj[id].toString());
// 			}
// 		} catch (err) {
// 			result.push(id + ': inaccessible');
// 		}
// 	}
// 	return result;
// }
