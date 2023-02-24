import { fuzzyQuickSearch } from '$lib/api/server/search/SearchIndex.js';

export async function GET({ url }) {
	const query = url.searchParams.get('query');

	if (!query) {
		return new Response(JSON.stringify({ status: 'error', message: 'Please provide a query' }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	return new Response(
		JSON.stringify({
			status: 'ok',
			data: await fuzzyQuickSearch(query, { limit: url.searchParams.get('limit') || 10 })
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}
