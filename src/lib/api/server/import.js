import { Asset, AssetBucket } from '$lib/api/server/db.js';
import { createAssetVersion } from '$lib/api/server/assets/AssetVersionManager.js';
import { queueAssetOptimisation } from '$lib/api/server/assets/AsyncOptimiser.js';

export async function chapterAssetsFromFormData(chapter, formdata, post) {
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

	// 1.eng.jpg -> 1
	// filename.eng.png -> filename
	// see if the filename is a number
	if (isNaN(formfiles[0][0].split('.')[0])) {
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

		for (const file of formfiles) {
			mergedImages.push([{ l: 'eng', blob: file[1] }]);
		}
	} else {
		for (const [filename, blob] of formfiles) {
			let [index, lang, extension] = filename.split('.');

			mergedImages[parseInt(index)] = [...(mergedImages[parseInt(index)] || [])];

			mergedImages[parseInt(index)].push({ l: extension ? lang : 'eng', blob });
		}

		mergedImages.sort((a, b) => {
			return a.index - b.index;
		});
	}

	// filter empty/null objects
	mergedImages = mergedImages.filter((a) => a);

	console.log(mergedImages);

	const assets = [];

	let i = 0;
	// create assets versions for each image
	for (const image of mergedImages) {
		// create assets
		const asset = await Asset.create({ indexInChapter: i });

		// if its the first assets, set it as the cover
		if (i === 0 && post) {
			post.posterAssetId = asset.id;
			await post.save();
		}

		for (const { l, blob } of image) {
			// fukin instane innt
			console.log(`creating asset version for lang "${l}" with using filename "${blob.name}"`);
			const assetBuffer = await blob.arrayBuffer();
			const version = await createAssetVersion(new Uint8Array(assetBuffer), l, true);
			await asset.addAssetData(version);
		}

		assets.push(asset);
		i++;
	}

	const assetbucket = await AssetBucket.create({
		snowflake: `${post.id}-${chapter.indexInParentPost}-assets`
	});

	for (const asset of assets) {
		// add assets to chapter & assetbucket
		await asset.setAssetBucket(assetbucket);
		await chapter.addAsset(asset);
		await queueAssetOptimisation(asset.id);
		console.log(`queued ${asset.id} for optimisation`);
	}
}
