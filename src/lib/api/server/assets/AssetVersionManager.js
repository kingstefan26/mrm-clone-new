import { AssetVersion } from '$lib/api/server/db.js';
import * as LocalFilesystem from '$lib/api/server/assets/providers/LocalFilesystem.js';

const storageProviders = [
	LocalFilesystem.definition,
	{
		name: 'cloudflareR2',
		create: undefined,
		get: undefined,
		destroy: undefined,
		uriPrefix: 'cloudflareR2://'
	},
	{
		name: 'stub',
		create: (arraybuffer) => {},
		get: (uri) => {
			let readStream;
			return readStream;
		},
		destroy: (uri) => {},
		uriPrefix: 'stub://'
	}
];

const getCurrentStorageProvider = () => {
	return storageProviders.find((provider) => provider.name === 'localFs');
};

export const getStreamFromAssetVersion = (assetVersion) => {
	const provider = storageProviders.find((provider) =>
		assetVersion.path.startsWith(provider.uriPrefix)
	);
	return provider.get(assetVersion.path);
};

export const destroyAssetVersion = async (assetVersion) => {
	const storageProvider = getCurrentStorageProvider();

	await storageProvider.destroy(assetVersion.path);
};

export async function createAssetVersion(arrayBuffer, lang) {
	const storageProvider = getCurrentStorageProvider();

	const { width, height, format, etag, uri, mimeType } = await storageProvider.create(arrayBuffer);

	return await AssetVersion.create({
		path: uri,
		width: width,
		height: height,
		lang,
		format: format,
		mimeType,
		etag,
		contentLength: arrayBuffer.byteLength
	});
}
