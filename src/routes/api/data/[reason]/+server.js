import { Author, Category, Genere, Series } from '$lib/api/server/db.js';
import { json } from '@sveltejs/kit';
import { protectEndpoint } from '$lib/util.js';

export async function GET({ locals, params, url }) {
	let a = protectEndpoint(locals)
	if(a) {
		return a
	}

	let returnData = { status: 'ok' };

	if (params.reason === 'authors') {
		let limit = url.searchParams.get('limit');
		if (!limit) {
			limit = 100;
		}

		const artists = await Author.findAll({
			limit: limit
		});
		returnData.data = artists.map((artist) => {
			return {
				longName: artist.longName,
				name: artist.name
			};
		});
	}

	if (params.reason === 'author') {
		const name = url.searchParams.get('name');
		if (!name) {
			returnData = { status: 'error', message: 'No name provided' };
		} else {
			const artist = await Author.findOne({
				where: {
					name: name
				}
			});
			returnData.data = { name: artist.name, longName: artist.longName, id: artist.id };
		}
	}

	if (params.reason === 'series') {
		const series = await Series.findAll();
		returnData.data = series.map((serie) => serie.name);
	}

	if (params.reason === 'generes') {
		const generes = await Genere.findAll();
		returnData.data = generes.map((genre) => genre.name);
	}

	if (params.reason === 'categories') {
		const categories = await Category.findAll();
		returnData.data = categories.map((category) => category.name);
	}

	return json(returnData);
}
