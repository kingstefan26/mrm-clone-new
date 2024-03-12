import { Author } from '$lib/api/server/db.js';
import {protectPage} from '$lib/util.js'

/** @type {import('./$types').Load} */
export async function load({locals}) {
	protectPage(locals)
	
	const auths = await Author.findAll();

	return { authors: JSON.parse(JSON.stringify(auths)) };
}
