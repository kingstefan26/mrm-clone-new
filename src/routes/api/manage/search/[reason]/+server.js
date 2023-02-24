import { recreateIndex } from '$lib/api/server/search/SearchIndex.js';

export async function POST({ locals, request, params }) {
	if (!locals.user.admin) {
		return new Response(JSON.stringify({ status: 'error', message: 'You are not logged in' }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	let returnData = { status: 'ok' };

	const jsonres = await request.json();

	if (params.reason === 'updateSeachIndex') {
		recreateIndex().then(() => {
			console.log('recreated search index');
		});
	}

	return new Response(JSON.stringify(returnData), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
