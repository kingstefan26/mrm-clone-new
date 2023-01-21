import {redirect} from "@sveltejs/kit";

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals, url }) {
    if (!locals.user.username && url.pathname !== '/admin/login') {
        throw redirect(307, '/admin/login');
    }

    return {
        user: locals.user && {
            username: locals.user.username,
            email: locals.user.email,
            image: locals.user.image,
            bio: locals.user.bio
        }
    };
}