import { fuzzyQuickSearch } from '$lib/api/server/SearchIndex.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const query = url.searchParams.get('query');

	if (!query) {
		return json({ status: 'error', message: 'Please provide a query' });
	}

	return json({
		status: 'ok',
		data: await fuzzyQuickSearch(query, { limit: url.searchParams.get('limit') || 10 })
	});
}
