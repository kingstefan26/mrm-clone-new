import { recreateSiteMap, sitemapCache } from '$lib/api/server/search/SearchIndex.js';

export async function GET({ locals, params, url }) {
	if (!sitemapCache) {
		await recreateSiteMap();
	}
	return new Response(sitemapCache.root, {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml'
		}
	});
}
