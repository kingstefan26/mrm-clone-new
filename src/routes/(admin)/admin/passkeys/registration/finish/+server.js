import { error, json } from '@sveltejs/kit';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { rpId, rpOrgin, uint8ArrayToBase64 } from '$lib/api/server/passkeys.js';
import { PasskeyChallenges, PasskeyCredentials, User } from '$lib/api/server/db.js';
import { TokenGenerator } from '$lib/api/server/controlers/TokenUtil.js';
import { saveSessionInJWT } from '../../../../../../hooks.server';


/** @type {import("./$types").RequestHandler} */
export async function POST({ request, cookies, locals }) {
	const userid = cookies.get('userid', { path: '/' });
	if (!userid) {
		error(400, 'missing userid');
	}

	const pc = await PasskeyChallenges.findOne({ where: { sessionId: userid } });

	if (!pc) {
		error(400, 'Cant find challenge');
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

		saveSessionInJWT(user, locals, cookies)
		return json({ verified: true });
	} else {
		error(400, 'Verification failed');
	}
}
