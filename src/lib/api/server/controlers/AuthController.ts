const superprivatepassphrase = 'a';

// gg from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
import { TokenGenerator } from '$lib/api/server/controlers/TokenUtil.js';
import * as DB from '$lib/api/server/db';

const getSHA256 = async (text: string) => {
	const msgUint8 = new TextEncoder().encode(text); // encode as (utf-8) Uint8Array
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export function verifyUserToken(token: string) {
	try {
		return new TokenGenerator().decode(token, superprivatepassphrase);
	} catch (_) {
		return {};
	}
}

export async function authenticateUser(email: string, passwrd: string) {
	const user = await DB.User.findOne({
		where: {
			email: email
		}
	});

	if (user === null) {
		return undefined;
	}

	const hash = await getSHA256(user.salt + passwrd);
	console.log(`calculated hash: ${hash}, expected hash: ${user.passHash}`);
	if (hash === user.passHash) {
		return new TokenGenerator(superprivatepassphrase, superprivatepassphrase, {
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

export async function createUser(data: {
	email: string;
	passHash: string;
	username: string;
	salt: string;
	admin: boolean;
}) {
	let user = await DB.User.findOne({
		where: {
			email: data.email
		}
	});
	if (!user) {
		user = await DB.User.create(data);
	}
	return user;
}
