import { AssetVersion } from '$lib/api/server/db.js';
import LocalFilesystem from '$lib/api/server/assets/providers/LocalFilesystem.js';
import cloudflarer2 from '$lib/api/server/assets/providers/r2.js';
import mime from 'mime-kind';
import sharp from 'sharp';

// export interface StorageProvider {
// 	name: string;
// 	create: (arraybuffer: ArrayBuffer, mimeType: string) => Promise<any> | null;
// 	get: (uri: string) => ReadableStream | undefined;
// 	get_full: (uri: string) => Promise<Buffer> | undefined;
// 	get_http_url: (uri: string) => string | undefined;
// 	destroy: (uri: string) => Promise<any>;
// 	uriPrefix: string;
// }

// jsdoc version:
/**
 * @typedef {Object} StorageProvider
 * @property {string} name
 * @property {(arraybuffer: ArrayBuffer, mimeType: string) => Promise<any> | null} create
 * @property {(uri: string) => ReadableStream | undefined} get
 * @property {(uri: string) => Promise<Buffer> | undefined} get_full
 * @property {(uri: string) => string | undefined} get_http_url
 * @property {(uri: string) => Promise<any>} destroy
 * @property {string} uriPrefix
 */

/**
 * @type {StorageProvider[]}
 */
const storageProviders = [LocalFilesystem, cloudflarer2];

/**
 * @returns {StorageProvider}
 */
const getCurrentStorageProvider = () => {
	return storageProviders.find((provider) => provider.name === 'localFs');
	// return storageProviders.find((provider) => provider.name === 'cloudflareR2');
};

/**
 * @param {string} uri
 * @returns {StorageProvider}
 */
function getStorageProvider(uri) {
	const provider = storageProviders.find((provider) => uri.startsWith(provider.uriPrefix));
	if (!provider) {
		throw new Error('Failed to get storage provider');
	}
	return provider;
}

/**
 * @param {AssetVersion} assetVersion
 * @returns {Promise<Buffer>}
 */
export function getBufferFromAssetVersion(assetVersion) {
	const buffer = getStorageProvider(assetVersion.path).get_full(assetVersion.path);
	if (!buffer) {
		throw new Error('Asset version not found');
	}
	return buffer;
}

/**
 * @param {AssetVersion} assetVersion
 * @returns {ReadableStream}
 */
export function getStreamFromAssetVersion(assetVersion) {
	const stream = getStorageProvider(assetVersion.path).get(assetVersion.path);
	if (!stream) {
		throw new Error('Asset version not found');
	}

	return stream;
}

/**
 * @param assetVersion
 * @returns {string|undefined}
 */
export function getUrlFromAssetVersion(assetVersion) {
	return getStorageProvider(assetVersion.path).get_http_url(assetVersion.path);
}

/**
 *
 * @param assetVersion
 * @returns {Promise<void>}
 */
export async function destroyAssetVersion(assetVersion) {
	await getStorageProvider(assetVersion.path).destroy(assetVersion.path);
}

/**
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Promise<String>}
 */
export async function getMimeType(arrayBuffer) {
	return (await mime(arrayBuffer)).mime;
}

/**
 * @param {string} mimeType
 * @returns {string}
 */
export function getFileExtension(mimeType) {
	switch (mimeType) {
		case 'image/jpeg':
			return 'jpg';
		case 'image/png':
			return 'png';
		case 'image/avif':
			return 'avif';
		case 'image/webp':
			return 'webp';
		case 'image/gif':
			return 'gif';
		default:
			throw new Error(`Unsupported mime type: ${mimeType}`);
	}
}

export async function createAssetVersion(arrayBuffer, lang, master = false) {
	const mimeType = await getMimeType(arrayBuffer);

	const { uri } = await getCurrentStorageProvider().create(arrayBuffer, mimeType);

	const etag = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1', arrayBuffer)))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	const metadata = await sharp(arrayBuffer).metadata();

	const assetVersionObj = {
		path: uri,
		width: metadata.width,
		height: metadata.height,
		lang,
		format: master ? 'master' : metadata.format,
		mimeType,
		etag,
		contentLength: arrayBuffer.byteLength
	};

	// TODO: This is a hack to check if the provider supports http urls
	const httpUrl = getCurrentStorageProvider().get_http_url(uri);
	if (httpUrl !== undefined) {
		assetVersionObj.httpUrl = httpUrl;
	}

	return AssetVersion.create(assetVersionObj);
}
