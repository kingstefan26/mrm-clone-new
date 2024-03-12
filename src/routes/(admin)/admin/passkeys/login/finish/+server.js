import { error, json } from '@sveltejs/kit';
import { PasskeyChallenges, PasskeyCredentials } from '$lib/api/server/db.js';
import { base64ToUint8Array, rpId, rpOrgin, uint8ArrayToBase64 } from '$lib/api/server/passkeys.js';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { TokenGenerator } from '$lib/api/server/controlers/TokenUtil.js';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { saveSessionInJWT } from '../../../../../../hooks.server'

/** @type {import("./$types").RequestHandler} */
export async function POST({ request, cookies, locals }) {

	const pc = await PasskeyChallenges.findOne({ where: { sessionId: locals.sessionId } });

	if (!pc) {
		return error(400, 'Cant find challenge');
	}

	let challenge = pc.challenge;
	pc.destroy().then(() => {
		console.log(`deleted challenge for sid ${locals.sessionId}`);
	});

	const jsonData = await request.json();

	const passkey = await PasskeyCredentials.findOne({
		where: { credId: uint8ArrayToBase64(isoBase64URL.toBuffer(jsonData.rawId)) }
	});

	if (!passkey) {
		error(404, 'Cant find passkey in db');
	}

	const opts = {
		response: jsonData,
		expectedChallenge: challenge,
		expectedOrigin: rpOrgin,
		expectedRPID: rpId,
		authenticator: {
			credentialID: base64ToUint8Array(passkey.credId),
			credentialPublicKey: base64ToUint8Array(passkey.pubKey),
			counter: passkey.counter,
			transports: passkey.transports
		}
	};

	const verification = await verifyAuthenticationResponse(opts);
	const { verified, authenticationInfo } = verification;
	if (verified) {
		passkey.counter = authenticationInfo.newCounter;
		passkey.save(); // don't await to save this, to speed up the request
		const user = await passkey.getUser();
		saveSessionInJWT(user, locals, cookies)

		return json({ verified: true });
	} else {
		error(401, 'Verification Failed');
	}
}
