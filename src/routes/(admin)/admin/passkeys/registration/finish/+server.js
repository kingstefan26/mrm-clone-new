import { error, json } from '@sveltejs/kit';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { rpId, rpOrgin, uint8ArrayToBase64 } from '$lib/api/server/passkeys.js';
import { PasskeyChallenges, PasskeyCredentials, User } from '$lib/api/server/db.js';
import { TokenGenerator } from '$lib/api/server/controlers/TokenUtil.js';

function getMethods(obj) {
	var result = [];
	for (var id in obj) {
		try {
			if (typeof obj[id] == 'function') {
				result.push(id + ': ' + obj[id].toString());
			}
		} catch (err) {
			result.push(id + ': inaccessible');
		}
	}
	return result;
}

/** @type {import("./$types").RequestHandler} */
export async function POST({ request, cookies }) {
	const userid = cookies.get('userid', { path: '/' });
	if (!userid) {
		error(400, 'missing userid');
	}

	const pc = await PasskeyChallenges.findOne({ where: { sessionId: userid } });

	if (!pc) {
		return error(400, 'Cant find challenge');
	}

	let challenge = pc.challenge;
	pc.destroy().then(() => {
		console.log(`deleted challenge for sid ${userid}`);
	});

	const jsonData = await request.json();
	const verification = await verifyRegistrationResponse({
		response: jsonData,
		expectedChallenge: challenge,
		expectedOrigin: rpOrgin,
		expectedRPID: rpId
	});

	if (verification.verified && verification.registrationInfo) {
		const { credentialPublicKey, credentialID, counter, credentialDeviceType, credentialBackedUp } =
			verification.registrationInfo;
		const user = await User.create({ username: pc.sessionId, admin: true });
		const passkey = await PasskeyCredentials.create({
			credId: uint8ArrayToBase64(credentialID),
			pubKey: uint8ArrayToBase64(credentialPublicKey),
			counter: counter,
			credentialDeviceType: credentialDeviceType,
			credentialBackedUp: credentialBackedUp,
			transports: jsonData.transports
		});
		await user.addPasskeyCredential([passkey]);
		await passkey.setUser(user);

		let token = new TokenGenerator('a', 'a', {
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
		return json({ verified: true });
	} else {
		error(400, 'Verification failed');
	}
}
