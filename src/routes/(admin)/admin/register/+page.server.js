import { fail, redirect } from '@sveltejs/kit';

import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (locals.user) {
		redirect(307, '/admin');
	}

	// Human-readable title for your website
	const rpName = 'Mrm Clone';
	// A unique identifier for your website
	const rpID = 'mrm-clone';
	// The URL at which registrations and authentications should occur
	const origin = `http://localhost:5173`;
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, request }) => {
		// const data = await request.formData();
		//
		// const body = {
		//     user: {
		//         email: data.get('email'),
		//         password: data.get('password')
		//     }
		// };

		// if (body.errors) {
		//     return fail(401, body);
		return fail(401, 'L BOZO');
		// }

		// const value = btoa(JSON.stringify(body.user));
		// cookies.set('jwt', value, { path: '/' });

		// throw redirect(307, '/admin');
	}
};
