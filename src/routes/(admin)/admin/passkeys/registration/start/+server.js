import { rpId, rpName } from '$lib/api/server/passkeys.js';
import { error, json } from '@sveltejs/kit';
import { PasskeyChallenges, User } from '$lib/api/server/db.js';
import { generateRegistrationOptions } from '@simplewebauthn/server';

/** @type {import("./$types").RequestHandler} */
export async function POST({ request, cookies }) {
	const { username } = await request.json();

	if (!username) {
		error(404, 'Username missing');
	}

	const usernameTaken = !!(await User.findOne({ where: { username } }));
	if (usernameTaken) {
		error(404, 'User already exists');
	}
	const options = await generateRegistrationOptions({
		rpName,
		rpId,
		userID: username,
		userName: username,
		timeout: 60000,
		attestationType: 'none',
		excludeCredentials: [],
		authenticatorSelection: {
			residentKey: 'preferred',
			userVerification: 'preferred',
			authenticatorAttachment: 'cross-platform'
		},
		supportedAlgorithmIDs: [-7, -257]
	});
	cookies.set('userid', username, { path: '/' });
	await PasskeyChallenges.create({ challenge: options.challenge, sessionId: username });
	return json(options);
}
