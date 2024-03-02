import { sequelize } from '$lib/api/server/db.js';
import { redirect } from '@sveltejs/kit';
import { recreateIndex } from '$lib/api/server/SearchIndex.js';
import { TokenGenerator } from '$lib/api/server/controlers/TokenUtil.js';
import * as DB from '$lib/api/server/db.js';

let dbInnted = false;

/** @type {import("@sveltejs/kit").Handle} */
export async function handle({ event, resolve }) {
	if (!dbInnted) {
		await sequelize.sync();
		let data = {
			username: 'kokoniara',
			email: 'kokoniara@kokoniara.software',
			passHash:
				'0df98a3973c6fe3725f0edc57b0d18484c72e3e22cde160be9fa5b47c6ca946997bd1515558370c98c854ba988fa1c82864bb1b8fb829279d605c80aaf0dfd6f',
			salt: 'ar@',
			admin: true
		};
		let user = await DB.User.findOne({
			where: {
				email: data.email
			}
		});
		if (!user) {
			await DB.User.create(data);
		}
		await recreateIndex();

		dbInnted = true;
	}

	const jwt = event.cookies.get('jwt');

	if (jwt) {
		let user = new TokenGenerator().decode(jwt, 'a');

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

	const response = await resolve(event);
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('Referrer-Policy', 'no-referrer');
	response.headers.set(
		'Permissions-Policy',
		'accelerometer=(), autoplay=(), camera=(), document-domain=(), encrypted-media=(), fullscreen=(), gyroscope=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()'
	);
	response.headers.set('X-Content-Type-Options', 'nosniff');

	return response;
}
