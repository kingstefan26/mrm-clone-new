import { Author, Category, Genere, Pairing, Post, Series, Tag } from '$lib/api/server/db.js';
import fuzzysort from 'fuzzysort';

let index = [
	// filled with stub data to show how it looks, cuz we don't do typescript round here
	{
		type: 'post',
		snowflake: 'stub title'
	},
	{
		type: 'tag',
		snowflake: 'Example tag'
	}
];

export let types = ['post', 'tag'];

export async function fuzzySearch(
	query = '',
	options = { limit: 10, filter: { tag: [], post: [] }, negfilter: { tag: [], post: [] } }
) {
	// do a fuzzy search on the index, if the query is empty, return the whole index
	let hits =
		query !== ''
			? fuzzysort.go(query, index, { key: 'snowflake', limit: options.limit }).map((res) => res.obj)
			: index;

	// filter the results based on the options object
	for (const type of types) {
		if (options.filter[type]) {
			hits = hits.filter((entry) => {
				return options.filter[type].includes(entry.snowflake);
			});
		}
		if (options.negfilter[type]) {
			hits = hits.filter((entry) => {
				return !options.negfilter[type].includes(entry.snowflake);
			});
		}
	}

	return hits || [];
}

export async function search(query, options) {
	// measure time
	console.time('search');
	const newVar = await this.getDataFromIndexResults(await this.fuzzySearch(query, options));
	console.timeEnd('search');
	return newVar;
}

export async function recreateIndex() {
	const tempIndex = [];
	const tempTypes = [];
	await Promise.all([
		Post.findAll().then((posts) => {
			tempTypes.push('post');
			posts.forEach((post) => {
				tempIndex.push({
					type: 'post',
					snowflake: post.title
				});
			});
		}),
		Tag.findAll().then((tags) => {
			tempTypes.push('tag');
			tags.forEach((tag) => {
				tempIndex.push({
					type: 'tag',
					snowflake: tag.name
				});
			});
		}),
		Series.findAll().then((series) => {
			tempTypes.push('series');
			series.forEach((serie) => {
				tempIndex.push({
					type: 'series',
					snowflake: serie.name
				});
			});
		}),
		Author.findAll().then((authors) => {
			tempTypes.push('author');
			authors.forEach((author) => {
				tempIndex.push({
					type: 'author',
					snowflake: author.name
				});
			});
		}),
		Category.findAll().then((categories) => {
			tempTypes.push('category');
			categories.forEach((category) => {
				tempIndex.push({
					type: 'category',
					snowflake: category.name
				});
			});
		}),
		Genere.findAll().then((generes) => {
			tempTypes.push('genre');
			generes.forEach((genere) => {
				tempIndex.push({
					type: 'genre',
					snowflake: genere.name
				});
			});
		}),
		Pairing.findAll().then((pairings) => {
			tempTypes.push('pairing');
			pairings.forEach((pairing) => {
				tempIndex.push({
					type: 'pairing',
					snowflake: pairing.name
				});
			});
		})
	]);

	// save the index
	index = tempIndex;
	types = tempTypes;
}

export async function getDataFromIndexResults(decodedResults = [{ type: '', snowflake: '' }]) {
	let map = decodedResults.map(async (result) => {
		if (result.type === 'post') {
			const post = await Post.findOne({
				where: {
					title: result.snowflake
				}
			});

			return {
				type: 'post',
				contents: {
					id: post.id,
					title: post.title,
					posterAssetId: post.posterAssetId
				},
				link: `/post/${post.id}`
			};
		} else if (result.type === 'series') {
			const genre = await Series.findOne({
				where: {
					name: result.snowflake
				}
			});

			return {
				type: 'series',
				contents: result.snowflake,
				link: `/post/${(await genre.getPosts())[0].id}`
			};
		} else if (result.type === 'author') {
			return {
				type: 'author',
				contents: result.snowflake,
				link: `/search?author=${result.snowflake}`
			};
		} else if (result.type === 'tag') {
			return {
				type: 'tag',
				contents: result.snowflake,
				link: `/search?tag=${result.snowflake}`
			};
		} else if (result.type === 'category') {
			return {
				type: 'category',
				contents: result.snowflake,
				link: `/search?category=${result.snowflake}`
			};
		} else if (result.type === 'genre') {
			return {
				type: 'genre',
				contents: result.snowflake,
				link: `/search?genre=${result.snowflake}`
			};
		} else if (result.type === 'pairing') {
			return {
				type: 'pairing',
				contents: result.snowflake,
				link: `/search?pairing=${result.snowflake}`
			};
		} else {
			console.error(`Unknown type ${result.type} in result ${result}`);
		}
	});
	map = await Promise.all(map);
	return map;
}
