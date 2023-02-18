import { fail, redirect } from '@sveltejs/kit';
import { authenticateUser } from '$lib/api/server/controlers/AuthController.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (locals.user && locals.user.admin) {
		throw redirect(307, '/admin');
	}
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
			throw redirect(307, '/admin');
		}
	}
};
