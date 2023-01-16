/** @type {import('./$types').LayoutServerLoad} */
import {redirect} from "@sveltejs/kit";

export function load({ locals }){
    if (!locals.user) {
        throw redirect(307, '/admin/login');
    }

    return {
        user: {
            email: locals.user.username
        }
    };
}