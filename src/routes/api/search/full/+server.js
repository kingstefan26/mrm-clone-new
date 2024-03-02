import * as SearchIndex from '$lib/api/server/SearchIndex.js';
import { types } from '$lib/api/server/SearchIndex.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const limit = url.searchParams.get('limit') || 10;

	let returnData = {
		status: 'ok',
		data: []
	};

	const options = {
		limit,
		filter: {},
		sort: url.searchParams.get('sort') || 'newest'
	};

	let query = url.searchParams.get('query') || '';

	console.log(options.sort);

	if (!['newest', 'oldest', 'relevant', 'random'].includes(options.sort)) {
		returnData = {
			status: 'error',
			error: 'invalid sort mode'
		};
		return json(returnData);
	}

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

	try {
		returnData.data = await SearchIndex.fuzzyPostSearch(query, options);
	} catch (error) {
		console.error(error);
		returnData = {
			status: 'error',
			error: 'failed searching'
		};
	}

	return json(returnData);
}
