import { redirect } from '@sveltejs/kit';
import { rpId } from '$lib/api/server/passkeys.js';
import { PasskeyChallenges } from '$lib/api/server/db.js';
import { generateAuthenticationOptions } from '@simplewebauthn/server';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, cookies }) {
	if (locals.user && locals.user.admin) {
		redirect(307, '/admin');
	}

	// generate the passkey challenge on the page load
	// to speed up the process.
	// although will generate a lot of junk challenges for non-passkey users
	const options = await generateAuthenticationOptions({
		timeout: 60000,
		allowCredentials: [],
		userVerification: 'required',
		rpId
	});

	const sessionId = crypto.randomUUID();
	cookies.set('userid', sessionId, { path: '/' });
	console.log(`creating challenge for the sessionId ${sessionId}: ${options.challenge}`);

	await PasskeyChallenges.create({ challenge: options.challenge, sessionId: sessionId });

	return {
		conditionalUiOptions: options
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	logout: async ({ cookies, locals }) => {
		cookies.delete('jwt', { path: '/' });
		locals.user = undefined;
		redirect(307, '/admin');
	}
};
