import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    if (locals.user) throw redirect(307, '/admin');
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ cookies, request }) => {
        const data = await request.formData();

        const body = {
            user: {
                email: data.get('email'),
                password: data.get('password')
            }
        };


        if (body.errors) {
            return fail(401, body);
        }

        const value = btoa(JSON.stringify(body.user));
        cookies.set('jwt', value, { path: '/' });

        throw redirect(307, '/admin');
    }
};
