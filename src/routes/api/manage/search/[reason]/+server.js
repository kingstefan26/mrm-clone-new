import { recreateIndex } from '$lib/api/server/SearchIndex.js';
import { json } from '@sveltejs/kit';

export async function POST({ locals, params }) {
	if (!locals.user.admin) {
		return json({ status: 'error', message: 'You are not logged in' });
	}

	if (params.reason === 'updateSeachIndex') {
		recreateIndex().then(() => {
			console.log('recreated search index');
		});
	}

	return json({ status: 'ok' });
}
