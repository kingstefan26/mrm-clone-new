/**
 * @param endpoint {string}
 * @param data {any}
 * @return {Promise<Response>}
 */
export default async function postJson(endpoint, data) {
	return await fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
}

export function getMethods(obj) {
	for (var id in obj) {
		try {
			if (typeof obj[id] == 'function') {
				console.log(id, obj[id]);
			}
		} catch (err) {
			/* empty */
		}
	}
}

import { json, redirect } from '@sveltejs/kit';

export function protectEndpoint(locals) {
	if (!locals.user) {
		return json({ status: 'error', message: 'You are not logged in' });
	} else if (!locals.user.admin) {
		return json({ status: 'error', message: 'Insufficent privlages' });
	} else {
		return undefined;
	}
}

export function protectPage(locals) {
	if (!locals.user) {
		redirect(307, '/admin/login');
	} else {
		if (!locals.user.admin) {
			redirect(307, '/admin/login');
		}
	}
}
