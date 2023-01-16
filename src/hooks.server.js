import {verifyUserToken} from "$lib/api/server/controler.js";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({event, resolve}) {
    const jwt = event.cookies.get('jwt');
    let user = await verifyUserToken(jwt)
    event.locals.user = user ? user : null

    return resolve(event);
}
