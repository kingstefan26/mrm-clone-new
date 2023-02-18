import { Asset, AssetBucket } from '$lib/api/server/db.js';
import { createAssetVersion } from '$lib/api/server/assets/AssetVersionManager.js';

export async function chapterAssetsFromFormData(chapter, formdata, post = undefined) {
	// console.log(formData)
	const formfiles = [];
	for (const entry of formdata.entries()) {
		// check if entry is a file and a image
		if (entry[1].constructor.name === 'File') {
			if (entry[1].type.startsWith('image/')) {
				formfiles.push(entry);
			}
		}
	}

	let mergedImages = [];
	const filename = formfiles[0][0].split('.')[0];
	// see if the index is a number
	if (isNaN(filename)) {
		// sort by filename
		formfiles.sort((a, b) => {
			// extract numer from name and compare them
			let match = a[0].match(/(\d+)/);
			match = match ? match : ['0'];
			const aNum = parseInt(match[0]);

			let match1 = b[0].match(/(\d+)/);
			match1 = match1 ? match1 : ['0'];
			const bNum = parseInt(match1[0]);

			if (aNum < bNum) {
				return -1;
			} else {
				return 1;
			}
		});

		// as a fallback just add the images as they are
		for (const file of formfiles) {
			const [filename, blob] = file;
			if (!blob.type.startsWith('image/')) {
				continue;
			}
			mergedImages.push({
				['eng']: {
					[filename.split('.')[1]]: blob
				}
			});
		}
	} else {
		// assamble images into a list of objects
		// each object has a diffrent internationalizations and image types per internationalization
		// while also sorting them by index
		for (const file of formfiles) {
			const [filename, blob] = file;
			if (!blob.type.startsWith('image/')) {
				continue;
			}
			const [index, lang, type] = filename.split('.');

			if (!type) {
				// 1.jpg
				const numberIndex = parseInt(index);
				if (!mergedImages[numberIndex]) {
					mergedImages[numberIndex] = {};
				}
				if (!mergedImages[numberIndex]['eng']) {
					mergedImages[numberIndex]['eng'] = {};
				}
				mergedImages[numberIndex]['eng'][lang] = blob;
			} else {
				// 1.en.jpg
				const numberIndex = parseInt(index);
				if (!mergedImages[numberIndex]) {
					mergedImages[numberIndex] = {};
				}
				if (!mergedImages[numberIndex][lang]) {
					mergedImages[numberIndex][lang] = {};
				}
				mergedImages[numberIndex][lang][type] = blob;
			}
		}
		// sort by index
		mergedImages.sort((a, b) => {
			return a.index - b.index;
		});
	}

	// filter empty/null objects
	mergedImages = mergedImages.filter((a) => a);

	const assetbucket = await AssetBucket.create({
		snowflake: `${post.id}-${chapter.indexInParentPost}-assets`
	});

	let i = 0;
	// create assets versions for each image
	for (const image of mergedImages) {
		// create assets
		const asset = await Asset.create({
			indexInChapter: i
		});

		// if its the first assets, set it as the cover
		if (i === 0) {
			if (post) {
				post.posterAssetId = asset.id;
				await post.save();
			}
		}

		await asset.setAssetBucket(assetbucket);

		// add assets to chapter
		await chapter.addAsset(asset);

		// create assets versions
		for (const lang in image) {
			for (const type in image[lang]) {
				const assetBuffer = await image[lang][type].arrayBuffer();
				const version = await createAssetVersion(new Uint8Array(assetBuffer), lang);
				await asset.addAssetData(version);
			}
		}
		i++;
	}
}
