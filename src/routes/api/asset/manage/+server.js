import { Asset } from '$lib/api/server/db.js';
import { json } from '@sveltejs/kit';

export async function POST({ locals, request }) {
	if (!locals.user.admin) {
		return json({ status: 'error', message: 'You are not logged in' });
	}

	let returnData = { status: 'ok' };

	const jsonres = await request.json();

	const { reason } = jsonres;

	if (!reason) {
		return json({ status: 'Bad Request' }, { status: 404 });
	}

	if (reason === 'getRecent') {
		const bucketId = jsonres['bucketId'];
		let recentAssets;
		if (bucketId) {
			recentAssets = await Asset.findAll({
				limit: 10,
				order: [['createdAt', 'DESC']],
				where: {
					AssetBucketId: bucketId
				}
			});
		} else {
			recentAssets = await Asset.findAll({
				limit: 10,
				order: [['createdAt', 'DESC']]
			});
		}

		recentAssets = JSON.parse(JSON.stringify(recentAssets));

		returnData = { status: 'ok', recentAssets };
	}

	return json(returnData);
}
