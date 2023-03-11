import { getFeed } from '$lib/api/server/controler.js';

/** @type {import("./$types").Load} */
export async function load({ params }) {
	return {
		stream: {
			feed: getFeed(params.page || 0, 10, false)
		}
	};
}
