import { Author, Category, Genere, Pairing, Post, Series, Tag } from '$lib/api/server/db.ts';
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

let postOnlyIndex = [];

let postIndex = new Map();
postIndex.set('Stub Title', { tags: ['MyTag1', 'MyTag2'], author: 'Nobody' });

export let types = ['post', 'category', 'genre', 'pairing', 'tag', 'series', 'author'];

export function getPostlessIndex() {
	const retrn = {};
	for (const type of types) {
		if (type === 'post') continue;
		retrn[type] = [];
		for (const entry of index) {
			if (entry.type === type) {
				retrn[type].push(entry.snowflake);
			}
		}
	}
	return retrn;
}

export async function fuzzyPostSearch(
	query = '',
	options = {
		limit: 10,
		sort: 'newest',
		filter: { tag: [], post: [] },
		negfilter: { tag: [], post: [] }
	}
) {
	console.time('PostSearch');

	// do a fuzzy search on the index, if the query is empty, return the whole index
	let hits =
		query !== ''
			? fuzzysort
					.go(query, postOnlyIndex, { key: 'snowflake', limit: options.limit })
					.map((res) => res.obj)
			: postOnlyIndex;

	// filter the results based on the options object
	for (const type of ['tag', 'category', 'genre', 'pairing', 'series']) {
		if (options.filter) {
			if (`${type}` in options.filter) {
				hits = hits.filter((entry) => {
					let post = postIndex.get(entry.snowflake);
					return post[type].some((item) => options.filter[type].includes(item));
				});
			}
		}
		if (options.negfilter) {
			if (`${type}` in options.negfilter) {
				hits = hits.filter((entry) => {
					let post = postIndex.get(entry.snowflake);
					return !post[type].some((item) => options.negfilter[type].includes(item));
				});
			}
		}
	}

	if (options.filter) {
		if (options.filter.author) {
			hits = hits.filter((entry) => {
				let post = postIndex.get(entry.snowflake);
				return post.author ? options.filter.author.includes(post.author) : true;
			});
		}
	}

	if (options.negfilter) {
		if (options.negfilter.author) {
			hits = hits.filter((entry) => {
				let post = postIndex.get(entry.snowflake);
				console.log(post);
				return post.author ? !options.negfilter.author.includes(post.author) : true;
			});
		}
	}

	const hitsWithData = await getDataFromIndexResults(hits || []);

	// sort the results based on the options object
	if (options.sort === 'newest') {
		hitsWithData.sort((a, b) => {
			return b.createdAt - a.createdAt;
		});
	} else if (options.sort === 'oldest') {
		hitsWithData.sort((a, b) => {
			return a.createdAt - b.createdAt;
		});
	} else if (options.sort === 'random') {
		hitsWithData.sort(() => {
			return Math.random() - 0.5;
		});
	} else if (options.sort === 'relevant') {
		// TODO: properly sort by relevance
		// for now just sort by newest
		hitsWithData.sort((a, b) => {
			return b.createdAt - a.createdAt;
		});
	}

	console.timeEnd('PostSearch');
	return hitsWithData;
}

export async function fuzzyQuickSearch(query = '', options = { limit: 10 }) {
	console.time('QuickSearch');

	// do a fuzzy search on the index, if the query is empty, return the whole index
	let hits =
		query !== ''
			? fuzzysort.go(query, index, { key: 'snowflake', limit: options.limit }).map((res) => res.obj)
			: index;

	const hitsWithData = getDataFromIndexResults(hits || []);
	console.timeEnd('QuickSearch');
	return hitsWithData;
}

export async function recreateIndex() {
	console.log("Recreating index, this'll take a while...");
	console.time('RecreateIndex');
	const tempIndex = [];
	const tempTypes = [];
	const temppostOnlyIndex = [];
	const tempPostindex = new Map();

	await Promise.all([
		Post.findAll({ include: [Tag, Category, Author, Genere, Pairing, Series] }).then((posts) => {
			tempTypes.push('post');

			posts.forEach((post) => {
				if (post.published === false) return;
				tempPostindex.set(post.title, {
					author: post.Author.name,
					tag: post.tags ? post.tags.map((tag) => tag.name) : [],
					category: post.categories ? post.categories.map((category) => category.name) : [],
					genre: post.generes ? post.generes.map((genere) => genere.name) : [],
					pairing: post.pairing ? post.pairing.map((pairing) => pairing.name) : [],
					series: post.series ? post.series.map((series) => series.name) : []
				});

				tempIndex.push({
					type: 'post',
					snowflake: post.title
				});
				temppostOnlyIndex.push({
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
	postOnlyIndex = temppostOnlyIndex;
	postIndex.clear();
	postIndex = tempPostindex;
	types = tempTypes;

	console.timeEnd('RecreateIndex');
}

export async function getDataFromIndexResults(decodedResults = [{ type: '', snowflake: '' }]) {
	if (decodedResults.length === 0) return [];
	let map = decodedResults.map(async (result) => {
		if (result.type === 'post') {
			const post = await Post.findOne({
				where: {
					title: result.snowflake
				},
				include: [Author]
			});

			return {
				type: 'post',
				contents: {
					id: post.id,
					title: post.title,
					posterAssetId: post.posterAssetId,
					Author: {
						name: post.Author.name
					},
					createdAt: post.createdAt
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
