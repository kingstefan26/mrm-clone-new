import { recreateSiteMap, sitemapCache } from '$lib/api/server/SearchIndex.js';

export async function GET({ params }) {
	if (!sitemapCache) await recreateSiteMap();
	if (!sitemapCache[params.cvm || '']) {
		return new Response('Not Found', { status: 404 });
	}
	return new Response(sitemapCache[params.cvm], {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml'
		}
	});
}
