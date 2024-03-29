import { error } from '@sveltejs/kit';
import { Asset, AssetVersion } from '$lib/api/server/db.js';
import {
	getStreamFromAssetVersion,
	getUrlFromAssetVersion
} from '$lib/api/server/assets/AssetVersionManager.js';

/** @type {import("./$types").RequestHandler} */
export async function GET({ params, request, url }) {
	const accepts = request.headers.get('accept');
	let acceptsWebp = accepts.includes('webp');
	let acceptsAvif = accepts.includes('avif');
	let acceptsJxl = accepts.includes('jxl');

	let internalisation = url.searchParams.get('lang') || 'eng';

	if (params.formatOverride) {
		if (params.formatOverride.endsWith('webp')) {
			acceptsWebp = true;
			acceptsAvif = false;
			acceptsJxl = false;
		} else if (params.formatOverride.endsWith('avif')) {
			acceptsAvif = true;
			acceptsWebp = false;
			acceptsJxl = false;
		} else if (params.formatOverride.endsWith('jxl')) {
			acceptsJxl = true;
			acceptsWebp = false;
			acceptsAvif = false;
		} else if (params.formatOverride.endsWith('jpg')) {
			acceptsJxl = false;
			acceptsWebp = false;
			acceptsAvif = false;
		}
	}

	const asset = await Asset.findOne({
		where: {
			id: params.id
		},
		include: [AssetVersion]
	});

	if (!asset) {
		error(404, 'Invalid Id');
	}

	// find version that match the internalisation and format,
	// with fallbacks, while respecting accepts header
	let assetVersionUsed;

	for (const version of asset.assetData) {
		if (version.lang === internalisation && version.format === 'heif' && acceptsAvif) {
			assetVersionUsed = version;
			break;
		}
	}

	if (!assetVersionUsed) {
		for (const version of asset.assetData) {
			if (version.lang === internalisation && version.format === 'jxl' && acceptsJxl) {
				assetVersionUsed = version;
				break;
			}
		}
	}

	if (!assetVersionUsed) {
		for (const version of asset.assetData) {
			if (version.lang === internalisation && version.format === 'webp' && acceptsWebp) {
				assetVersionUsed = version;
				break;
			}
		}
	}

	if (!assetVersionUsed) {
		for (const version of asset.assetData) {
			if (version.format === 'heif' && acceptsAvif) {
				assetVersionUsed = version;
				break;
			}
		}
	}

	if (!assetVersionUsed) {
		for (const version of asset.assetData) {
			if (version.format === 'jxl' && acceptsJxl) {
				assetVersionUsed = version;
				break;
			}
		}
	}

	if (!assetVersionUsed) {
		for (const version of asset.assetData) {
			if (version.format === 'webp' && acceptsWebp) {
				assetVersionUsed = version;
				break;
			}
		}
	}

	if (!assetVersionUsed) {
		assetVersionUsed = asset.assetData[0];
	}

	if (!assetVersionUsed) {
		error(404, 'Invalid version');
	}

	const img_url = getUrlFromAssetVersion(assetVersionUsed);

	if (img_url) {
		return new Response('', {
			status: 307,
			headers: {
				Location: img_url
			}
		});
	}

	const stream = getStreamFromAssetVersion(assetVersionUsed);

	if (!stream) {
		console.error(`failed to load asset ${params.id} version ${assetVersionUsed.version}`);
		error(404, 'Invalid version');
	}

	return new Response(stream, {
		headers: {
			'Content-Type': assetVersionUsed.mimeType,
			'Cache-Control': 'max-age=31536000, public, immutable',
			ETag: assetVersionUsed.etag
		}
	});
}
