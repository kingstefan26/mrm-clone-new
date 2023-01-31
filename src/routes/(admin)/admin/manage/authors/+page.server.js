import {Author} from "$lib/api/server/db.js";

/** @type {import('./$types').Load} */
export async function load() {
    const auths = await Author.findAll()

    return {authors: JSON.parse(JSON.stringify(auths))}
}