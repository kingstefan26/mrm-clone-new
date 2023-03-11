import { AssetVersion } from '$lib/api/server/db';
import LocalFilesystem from '$lib/api/server/assets/providers/LocalFilesystem';
import * as Stream from 'stream';

export interface StorageProvider {
	name: string;
	create: (arraybuffer: ArrayBuffer) => Promise<any> | null;
	get: (uri: string) => ReadableStream | undefined;
	destroy: (uri: string) => Promise<any>;
	uriPrefix: string;
}

const storageProviders = [
	LocalFilesystem
	// ,
	// {
	// 	name: 'cloudflareR2',
	// 	create: undefined,
	// 	get: undefined,
	// 	destroy: undefined,
	// 	uriPrefix: 'cloudflareR2://'
	// }
];

const getCurrentStorageProvider = () => {
	return storageProviders.find((provider) => provider.name === 'localFs');
};

export const getStreamFromAssetVersion = (assetVersion: { path: string }): ReadableStream => {
	const provider = storageProviders.find((provider) =>
		assetVersion.path.startsWith(provider.uriPrefix)
	);
	if (!provider) {
		throw new Error('Failed to find storage provider');
	}
	// @ts-ignore
	const stream = provider.get(assetVersion.path);
	if (!stream) {
		throw new Error('Asset version not found');
	}

	return stream;
};

export const destroyAssetVersion = async (assetVersion: { path: string }) => {
	const storageProvider = getCurrentStorageProvider();

	await storageProvider.destroy(assetVersion.path);
};

export async function createAssetVersion(
	arrayBuffer: ArrayBuffer,
	lang: string,
	master: boolean = false
) {
	const storageProvider = getCurrentStorageProvider();
	const { width, height, format, etag, uri, mimeType } = await storageProvider.create(arrayBuffer);

	return await AssetVersion.create({
		path: uri,
		width: width,
		height: height,
		lang,
		format: master ? 'master' : format,
		mimeType,
		etag,
		contentLength: arrayBuffer.byteLength
	});
}
