import { createAssetVersion, getStreamFromAssetVersion } from './AssetVersionManager';
import { Asset } from '$lib/api/server/db.js';
import { AvifOptimiser, JpegOptimiser, WebpOptimiser } from '$lib/api/server/assets/Optimiser';

const queue = new Map();
let queueLock = false;

export const runQueue = async () => {
	if (queueLock) {
		return;
	}
	queueLock = true;

	while (queue.size > 0) {
		const [assetId, task] = queue.entries().next().value;
		try {
			await task();
		} catch (error) {
			console.error(error);
		} finally {
			queue.delete(assetId);
		}
	}

	queueLock = false;
};

const stream2buffer = async (stream) => {
	const chunks = [];
	for await (const chunk of stream) chunks.push(chunk);
	return Buffer.concat(chunks);
};

export const queueAssetOptimisation = async (assetId: string) => {
	queue.set(assetId, async () => {
		// get the asset from the db
		const asset = await Asset.findOne({ where: { id: assetId } });

		if (!asset) throw new Error(`Asset with id ${assetId} not found`);

		// get the asset versions
		const assetVersions = await asset.getAssetData();

		if (assetVersions.length === 0)
			throw new Error(`Asset with id ${assetId} has no asset versions`);

		// given the asset versions, we assable the missing formats
		// assemble the missing formats
		// into the following object:
		// {eng : {webp: true, jpg: true, avif: true}, pt: {webp: true, jpg: true, avif: false}}
		let missingFormats = {};
		for (const assetVersion of assetVersions) {
			if (!missingFormats[`${assetVersion.lang}`]) {
				missingFormats[`${assetVersion.lang}`] = {};
			}
			missingFormats[`${assetVersion.lang}`][`${assetVersion.format}`] = true;
		}

		for (const [lang, missingObj] of Object.entries(missingFormats)) {
			// get the asset version that matches the lang and is a master
			const master = assetVersions.find((assetVersion: { lang: any; format: string }) => {
				return assetVersion.lang === lang && assetVersion.format === 'master';
			});

			if (!master)
				throw new Error(`Asset ${assetId} is missing a master version for language ${lang}`);

			const buffer = await stream2buffer(getStreamFromAssetVersion(master));

			if (!missingObj['webp']) {
				console.log(`optimising webp: ${assetId}`);
				const optimisedBuffer = await WebpOptimiser.optimise(buffer);
				await asset.addAssetData(await createAssetVersion(optimisedBuffer, lang, false));
			}

			if (!missingObj['jpg']) {
				console.log(`optimising jpg: ${assetId}`);
				const optimisedBuffer = await JpegOptimiser.optimise(buffer);
				await asset.addAssetData(await createAssetVersion(optimisedBuffer, lang, false));
			}

			if (!missingObj['avif']) {
				console.log(`optimising avif: ${assetId}`);
				const optimisedBuffer = await AvifOptimiser.optimise(buffer);
				await asset.addAssetData(await createAssetVersion(optimisedBuffer, lang, false));
			}
		}
	});

	runQueue();
};
