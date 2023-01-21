/** @type {import('./$types').LayoutServerLoad} */
import {redirect} from "@sveltejs/kit";

export function load({ locals }){

    return {
        user: {
            email: locals.user.username
        }
    };
}