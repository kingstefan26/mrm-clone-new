import { error, json } from '@sveltejs/kit';
import { PasskeyChallenges, PasskeyCredentials } from '$lib/api/server/db.js';
import { base64ToUint8Array, rpId, rpOrgin, uint8ArrayToBase64 } from '$lib/api/server/passkeys.js';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { TokenGenerator } from '$lib/api/server/controlers/TokenUtil.js';
import { isoBase64URL } from '@simplewebauthn/server/helpers';

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
		error(401, 'Verification Failed');
	}
}
