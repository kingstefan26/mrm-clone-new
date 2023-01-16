import {authenticateUser, verifyUserToken} from "$lib/api/server/controler.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }){
    let email = url.searchParams.get("email")
    let hash = url.searchParams.get("hash")

    let token = await authenticateUser(email, hash)
    console.log(verifyUserToken(token))
    return new Response( token,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}