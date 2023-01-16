/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
    console.log(locals.user)

    return {
        user: locals.user && {
            username: locals.user.username,
            email: locals.user.email,
            image: locals.user.image,
            bio: locals.user.bio
        }
    };
}