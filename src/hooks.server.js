import { sequelize } from '$lib/api/server/db.js';
import { recreateIndex } from '$lib/api/server/SearchIndex.js';
import { TokenGenerator } from '$lib/api/server/controlers/TokenUtil.js';
import {User} from '$lib/api/server/db.js';

export function saveSessionInJWT(user, locals, cookies) {
	let token = new TokenGenerator('a', 'a', {
		algorithm: 'HS256',
		keyid: '1',
		noTimestamp: false,
		expiresIn: '10d',
		notBefore: '0'
	}).sign(
		{
			username: user.username,
			id: user.id,
			admin: user.admin
		},
		{
			audience: 'myaud',
			issuer: 'mrm-main-server',
			jwtid: '1',
			subject: 'user'
		}
	);

	cookies.set('jwt', token, { path: '/' });
	cookies.set('userid', user.username, { path: '/' });

	locals.user = {
		username: user.username,
		id: user.id,
		admin: user.admin
	}
}

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
		let user = await User.findOne({
			where: {
				email: data.email
			}
		});
		if (!user) {
			await User.create(data);
		}
		await recreateIndex();

		dbInnted = true;
	}

	let sessionId = event.cookies.get('sessionid');
	if(!sessionId) {
		sessionId = crypto.randomUUID()
		event.cookies.set('sessionid', sessionId, { path: '/' });	 
	}
	event.locals.sessionId = sessionId

	const jwt = event.cookies.get('jwt');
	if (jwt) {
		try {
			event.locals.user = new TokenGenerator().decode(jwt, 'a');
		} catch (e) {
			console.log('Failed decoding jwt, expired?');
			event.cookies.delete('jwt', { path: '/' });
			event.locals.user = null;
		}
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
