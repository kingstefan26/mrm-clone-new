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
		let user = null;
		try {
			user = new TokenGenerator().decode(jwt, 'a');
		} catch (e) {
			console.log('Failed decoding jwt');
			event.cookies.delete('jwt', { path: '/' });
		}
		event.locals.user = user;
	}

	// login guards
	let shouldRedirect;
	shouldRedirect = !event.locals.user || !event.locals.user.admin;
	shouldRedirect =
		shouldRedirect &&
		!event.url.pathname.startsWith('/admin/login') &&
		!event.url.pathname.startsWith('/admin/register') &&
		!event.url.pathname.startsWith('/admin/passkeys');

	if (shouldRedirect) {
		redirect(307, '/admin/login');
		return;
	}

	const response = await resolve(event);
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('Referrer-Policy', 'no-referrer');
	response.headers.set(
		'Permissions-Policy',
		'accelerometer=(), autoplay=(), camera=(), encrypted-media=(), fullscreen=(), gyroscope=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=self, sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()'
	);
	response.headers.set('X-Content-Type-Options', 'nosniff');

	return response;
}
