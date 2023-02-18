import { logView } from '$lib/api/server/analytics/PageViews.js';

export async function POST({ request }) {
	// get the postid and chapter index from the request
	const { postId, chapterIndex, type } = await request.json();
	// validate that they exist
	if (!postId || !type) {
		return new Response(
			JSON.stringify({ status: 'error', message: 'missing postid or chapterIndex' }),
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
	if (type === 'view') {
		// log the view
		await logView(postId, chapterIndex);
	}

	return new Response(JSON.stringify({ status: 'ok' }), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
