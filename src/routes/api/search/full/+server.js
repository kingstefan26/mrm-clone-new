import { types } from '$lib/api/server/search/SearchIndex.js';
import * as SearchIndex from '$lib/api/server/search/SearchIndex.js';

export async function GET({ url }) {
	const limit = url.searchParams.get('limit') || 10;

	let returnData = {
		status: 'ok',
		data: []
	};

	const options = {
		limit,
		filter: {}
	};

	let query = url.searchParams.get('query') || '';

	// ?tag=foo,bar&pairing=aliceAndBob
	for (const type of types) {
		const searchQry = url.searchParams.get(type);
		// we check if 'type' param exists
		if (searchQry) {
			// if it does, get the values by splitting it by comma, and add it to the options object
			options.filter[type] = searchQry.split(',');
		}
	}

	// ?!tag=foo,bar&!pairing=aliceAndBob
	for (const type of types) {
		const searchQry = url.searchParams.get('!' + type);
		// we check if 'type' param exists
		if (searchQry) {
			// if it does, get the values by splitting it by comma, and add it to the options object
			options.negfilter[type] = searchQry.split(',');
		}
	}

	console.log(query, options);

	try {
		returnData.data = await SearchIndex.search(query, options);
	} catch (error) {
		returnData = {
			status: 'error',
			error: error.message
		};
	}

	return new Response(JSON.stringify(returnData), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
