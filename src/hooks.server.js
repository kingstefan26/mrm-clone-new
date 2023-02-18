import { sequelize } from '$lib/api/server/db.js';
import { redirect } from '@sveltejs/kit';
import SearchIndex from '$lib/api/server/search/SearchIndex.js';
import { createUser, verifyUserToken } from '$lib/api/server/controlers/AuthController.js';

let dbInnted = false;

/** @type {import("@sveltejs/kit").Handle} */
export async function handle({ event, resolve }) {
	if (!dbInnted) {
		await sequelize.sync();
		await createUser({
			username: 'kokoniara',
			email: 'kokoniara@kokoniara.software',
			passHash: '7fcc7ca181147588e8a0515d7ec889611ccbe5d622a2ec169e592c711598ba8a',
			salt: 'ar@',
			admin: true
		});
		await SearchIndex.recreateIndex();

		// AssetBucket.findOne({ where: { snowflake: 'default' } }).then(async (bucket) => {
		// 	bucket = bucket || (await AssetBucket.create({ snowflake: 'default' }));
		// 	console.log('hello???', bucket);
		// 	console.log(getMethods(bucket));
		// 	getMethods(bucket);
		// });

		dbInnted = true;
	}

	const jwt = event.cookies.get('jwt');

	if (jwt) {
		let user = await verifyUserToken(jwt);
		event.locals.user = user ? user : null;

		if (event.url) {
			if (
				event.url.pathname.startsWith('/admin/') &&
				!event.url.pathname.startsWith('/admin/login') &&
				!user.admin
			) {
				return redirect(307, `${event.url.origin}/admin/login`);
			}
		}
	}

	return resolve(event);
}
