import { fail, redirect } from '@sveltejs/kit';
import {authenticateUser, verifyUserToken} from "$lib/api/server/controler.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    if (locals.user.username) throw redirect(307, '/admin');
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ cookies, request }) => {
        const data = await request.formData();

        let token = await authenticateUser(data.get('email'), data.get('password'))

        console.log(token)

        if(!token){
            return fail(401);
        } else {
            cookies.set('jwt', token, { path: '/' });
            throw redirect(307, '/admin');
        }


    }
};
