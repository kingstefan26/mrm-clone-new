/** @type {import('./$types').LayoutServerLoad} */
import {redirect} from "@sveltejs/kit";

export function load({ locals }){
    if (!locals.user) {
        throw redirect(307, '/admin/login');
    }
    console.log(locals.user)
    const user = locals.user
    return {
        user: {
            email: user.email
        }
    };
}