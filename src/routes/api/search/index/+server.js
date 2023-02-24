import { getPostlessIndex } from '$lib/api/server/search/SearchIndex.js';

export async function GET() {
	return new Response(JSON.stringify(getPostlessIndex()), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
