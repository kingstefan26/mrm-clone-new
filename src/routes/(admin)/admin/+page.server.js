/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	return {
		user: {
			email: locals.user.username
		}
	};
}
