import { Asset } from '$lib/api/server/db.js';
import { createAssetVersion } from '$lib/api/server/assets/AssetVersionManager.js';

export async function POST({ locals, request }) {
	if (!locals.user.admin) {
		return new Response(JSON.stringify({ status: 'error', message: 'You are not logged in' }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	// read form data from request
	const formData = await request.formData();

	// get the file from the form data
	const fileFromFrom = formData.get('file');

	// get the buffer from the file
	const buffer = await fileFromFrom.arrayBuffer();

	let lang = formData.get('lang');

	const version = await createAssetVersion(new Uint8Array(buffer), lang ? lang : 'en');

	const asset = await Asset.create({ indexInChapter: 0 });
	asset.addAssetData(version);

	const returnAsset = JSON.parse(JSON.stringify(asset));

	await new Promise((resolve) => setTimeout(resolve, 1000));

	return new Response(JSON.stringify({ status: 'ok', asset: returnAsset }), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
