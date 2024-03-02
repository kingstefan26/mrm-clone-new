import {
	Asset,
	Author,
	Category,
	Chapter,
	Genere,
	Post,
	Series,
	Status
} from '$lib/api/server/db.js';
import { json } from '@sveltejs/kit';
import * as DB from '$lib/api/server/db.js';

export async function POST({ locals, request, params }) {
	if (!locals.user.admin) {
		return json({ status: 'error', message: 'You are not logged in' });
	}

	let returnData = { status: 'ok' };

	const req = await request.json();

	if (params.reason === 'title') {
		const { title, postId } = req;

		console.log(`updating post ${postId} title to ${title}`);

		await Post.update({ title }, { where: { id: postId } });
	}

	if (params.reason === 'author') {
		const { author, postId } = req;

		console.log(`updating post ${postId} author to ${author}`);

		let post = await Post.findOne({
			where: {
				id: postId
			},
			include: [Author]
		});

		if (post.author && post.author.name === author) {
			console.log('author is already set');
		} else {
			const authorO = await Author.findOne({ where: { name: author } });

			await post.setAuthor(authorO);

			console.log(`set author ${authorO.name} with id ${authorO.id}`);
		}
	}

	if (params.reason === 'tags') {
		const { tags, postId } = req;

		console.log(`updating post ${postId} tags to `, tags);

		const post = await Post.findOne({ where: { id: postId } });

		const postTags = await post.getTags();

		const toDelete = postTags.filter((tag) => !tags.includes(tag.name));
		await post.removeTags(toDelete);

		const oldTagNames = postTags.map((tag) => tag.name);
		const toCreate = tags.filter((tag) => !oldTagNames.includes(tag));
		for (const tag of toCreate) {
			await post.createTag({ name: tag });
		}
	}

	if (params.reason === 'description') {
		const { description, postId } = req;

		console.log(`updating post ${postId} description to ${description}`);

		await Post.update({ description }, { where: { id: postId } });
	}

	if (params.reason === 'poster') {
		const { posterAssetId, postId } = req;

		console.log(`updating post ${postId} poster asset to ${posterAssetId}`);

		await Post.update({ posterAssetId }, { where: { id: postId } });
	}

	if (params.reason === 'published') {
		console.log(req);
		const { published, postId } = req;

		console.log(`updating post ${postId} published to ${published}`);

		await Post.update({ published: published }, { where: { id: postId } });
	}

	if (params.reason === 'chapter') {
		const { name, postId } = req;

		const post = await Post.findOne({ where: { id: postId } });

		const chapterCount = await Chapter.count({ where: { postId: post.id } });

		let nextChapterIndex = chapterCount;

		const chapter = await Chapter.create({
			name: name,
			published: false,
			indexInParentPost: nextChapterIndex
		});

		await chapter.setPost(post);

		post.chapterCount = await DB.Chapter.count({
			where: {
				postId: post.id
			}
		});

		await post.save();

		console.log(`created chapter ${chapter.id} for post ${post.id} with name ${chapter.name}`);

		returnData = {
			status: 'ok',
			data: { newChapterId: chapter.id, chapterIndex: chapter.indexInParentPost }
		};
	}

	if (params.reason === 'updatechapter') {
		const { chapterId, name, published, western, sensitiveContent } = req;

		const chapter = await Chapter.findOne({ where: { id: chapterId } });

		console.log(
			`updating chapter ${chapterId} with name ${name}, published ${published}, western ${western}, sensitiveContent ${sensitiveContent}`
		);

		chapter.name = name;
		chapter.published = published;
		chapter.western = western;
		chapter.sensitiveContent = sensitiveContent;

		await chapter.save();
	}

	if (params.reason === 'deletechapter') {
		const { chapterId } = req;

		await Chapter.destroy({ where: { id: chapterId } });
	}

	if (params.reason === 'updateChapterAssets') {
		const { chapterId, assets } = req;

		const chapter = await Chapter.findOne({ where: { id: chapterId } });
		// console.log(`updating chapter ${chapterId} assets to `, assets)

		// remove all assets, and then add new ones one by one
		await chapter.removeAssets();

		assets.sort((a, b) => a.indexInParentChapter - b.indexInParentChapter);

		for (const asset of assets) {
			const assetObj = await Asset.findOne({ where: { id: asset.id } });
			assetObj.setChapter(chapter);
			await chapter.addAsset(assetObj, {
				through: { indexInParentChapter: asset.indexInParentChapter }
			});
		}

		let upadtedChapter = await Chapter.findOne({ where: { id: chapterId } });
		// let updatedAssets = JSON.parse(JSON.stringify(await upadtedChapter.getAssets()));
		// console.log(`after update`,  updatedAssets)

		returnData = { status: 'ok', data: { chapter: upadtedChapter } };
	}

	if (params.reason === 'delete') {
		const { postId } = req;

		await Post.destroy({ where: { id: postId } });
		await Chapter.destroy({ where: { postId } });
	}

	if (params.reason === 'createSeries') {
		await Series.create({ name: req.name });
	}

	if (params.reason === 'addToSeries') {
		const { postId, seriesName } = req;

		console.log(`adding post ${postId} to series ${seriesName}`);

		const series = await Series.findOne({ where: { name: seriesName } });
		const post = await Post.findOne({ where: { id: postId } });

		await series.addPost(post);

		// change indexes of all posts in the series
		const posts = await series.getPosts();
		for (let i = 0; i < posts.length; i++) {
			const post = posts[i];
			post.indexInSeries = i;
			await post.save();
		}
	}

	if (params.reason === 'updateIndexInSeries') {
		const { postId, indexInSeries, seriesName } = req;

		console.log(`updating post ${postId} index in series ${seriesName} to ${indexInSeries}`);

		// reorder the posts in the series based on the new index
		const series = await Series.findOne({ where: { name: seriesName } });
		const posts = await series.getPosts();

		await series.removePosts();

		for (let i = 0; i < posts.length; i++) {
			const post = posts[i];
			if (post.id === postId) {
				post.indexInSeries = indexInSeries;
				await post.save();
				await series.addPost(post, { through: { indexInSeries } });
			} else {
				post.indexInSeries = i;
				await post.save();
				await series.addPost(post, { through: { indexInSeries: i } });
			}
		}
	}

	if (params.reason === 'removeFromSeries') {
		const { postId, seriesName } = req;

		console.log(`removing post ${postId} from series ${seriesName}`);

		const series = await Series.findOne({ where: { name: seriesName } });
		const post = await Post.findOne({ where: { id: postId } });

		await series.removePost(post);
		// reorder the posts in the series based on the new index
		const posts = await series.getPosts();
		for (let i = 0; i < posts.length; i++) {
			const post = posts[i];
			await series.addPost(post, { through: { indexInSeries: i } });
		}
	}

	if (params.reason === 'createAuthor') {
		const { name } = req;

		console.log(`creating author ${name}`);

		await Author.create({ name });
		returnData = { status: 'ok', data: { name } };
	}

	if (params.reason === 'updateAuthor') {
		const { longName, id, name } = req;

		console.log(`updating author ${id} with name ${name} and longName ${longName}`);
		const author = await Author.findOne({ where: { id } });
		author.name = name;
		author.longName = longName;
		await author.save();
		returnData = {
			status: 'ok',
			data: { name: author.name, longName: author.longName, id: author.id }
		};
	}

	if (params.reason === 'updateGeneres') {
		const { postId, genres } = req;
		if (!genres) {
			return json({ status: 'error', data: { message: 'no generes provided' } });
		}
		if (!postId) {
			return json({ status: 'error', data: { message: 'no postId provided' } });
		}

		console.log(`updating post ${postId} generes to :`, genres);

		let post = await Post.findOne({ where: { id: postId } });

		for (const genere of await post.getGeneres()) {
			await post.removeGenere(genere);
		}

		post = await Post.findOne({ where: { id: postId } });

		// for each genere, find it in the db, and add it to the post
		for (const genere of genres.filter((obj) => obj)) {
			const [genereObj] = await Genere.findOrCreate({
				where: { name: genere },
				defaults: { name: genere }
			});
			await post.addGenere(genereObj);
		}

		// return the updated generes
		const updatedGeneres = await post.getGeneres();
		returnData = { status: 'ok', data: { generes: updatedGeneres } };
	}

	if (params.reason === 'updateCategories') {
		const { postId, categories } = req;
		if (!categories) {
			return json({ status: 'error', data: { message: 'no categories provided' } });
		}
		if (!postId) {
			return json({ status: 'error', data: { message: 'no postId provided' } });
		}

		console.log(`updating post ${postId} categories to :`, categories);

		let post = await Post.findOne({ where: { id: postId } });

		// remove all categories from the post
		for (const category of await post.getCategories()) {
			await post.removeCategory(category);
		}

		// for each category, find it in the db, and add it to the post
		for (const category of categories.filter((obj) => obj)) {
			const [categoryObj] = await Category.findOrCreate({
				where: { name: category },
				defaults: { name: category }
			});
			await post.addCategory(categoryObj);
		}

		// return the updated categories
		const updatedCategories = await post.getCategories();
		returnData = { status: 'ok', data: { categories: updatedCategories } };
	}

	if (params.reason === 'updateStatus') {
		const { postId, status } = req;
		if (!status) {
			return json({ status: 'error', data: { message: 'no status provided' } });
		}
		if (!postId) {
			return json({ status: 'error', data: { message: 'no postId provided' } });
		}
		console.log(`updating post ${postId} status to `, status);

		let [statusObj] = await Status.findOrCreate({
			where: { name: status },
			defaults: { name: status }
		});

		const post = await Post.findOne({ where: { id: postId } });
		post.setStatus(statusObj);

		returnData = { status: 'ok', data: { status: statusObj.name } };
	}

	return json(returnData);
}
