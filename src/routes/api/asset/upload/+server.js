import { Asset } from '$lib/api/server/db.js';
import { createAssetVersion } from '$lib/api/server/assets/AssetVersionManager.js';
import { json } from '@sveltejs/kit';

export async function POST({ locals, request }) {
	if (!locals.user.admin) {
		return json({ status: 'error', message: 'You are not logged in' });
	}

	// read form data from request
	const formData = await request.formData();

	// get the file from the form data
	const fileFromFrom = formData.get('file');

	// get the buffer from the file
	const buffer = await fileFromFrom.arrayBuffer();

	let lang = formData.get('lang');

	const version = await createAssetVersion(new Uint8Array(buffer), lang ? lang : 'en', true);

	const asset = await Asset.create({ indexInChapter: 0 });
	asset.addAssetData(version);

	const returnAsset = JSON.parse(JSON.stringify(asset));

	return json({ status: 'ok', asset: returnAsset });
}
