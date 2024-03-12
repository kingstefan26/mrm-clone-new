import {protectPage} from '$lib/util.js'


/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	protectPage(locals)
	return {
		user: {
			email: locals.user.username
		}
	};
}
