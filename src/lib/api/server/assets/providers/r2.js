import { getFileExtension } from '$lib/api/server/assets/AssetVersionManager.js';
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';

import {
	S3_ACCESS_KEY_ID,
	S3_BUCKET_NAME,
	S3_ENDPOINT,
	S3_HOST_URL,
	S3_SECRET_ACCESS_KEY
} from '$env/static/private';

const s3Client = new S3Client({
	endpoint: S3_ENDPOINT,
	region: 'auto',
	credentials: {
		accessKeyId: S3_ACCESS_KEY_ID,
		secretAccessKey: S3_SECRET_ACCESS_KEY
	}
});

/**
 * @typedef {import('../AssetVersionManager.js').StorageProvider} StorageProvider
 * @type StorageProvider
 */
const newVar = {
	name: 'cloudflareR2',
	uriPrefix: 'r2://',
	create: async (arrayBuffer, mimeType) => {
		const filename = crypto.randomUUID() + '.' + getFileExtension(mimeType);

		console.log('uploading to bucket', S3_BUCKET_NAME, 'with filename', filename);

		// arraybuffer to buffer
		const buffer = Buffer.from(arrayBuffer);

		const command = new PutObjectCommand({
			Bucket: S3_BUCKET_NAME,
			Key: filename,
			Body: buffer
		});

		await s3Client.send(command);

		const uri = newVar.uriPrefix + filename;

		return {
			uri
		};
	},
	// @ts-ignore
	get: (uri) => {
		return undefined;
	},
	get_http_url: (uri) => {
		const acuallocalPath = uri.substring(newVar.uriPrefix.length);

		return S3_HOST_URL + acuallocalPath;
	},
	destroy: async (path) => {
		const acuallocalPath = path.substring(newVar.uriPrefix.length);
		const command = new DeleteObjectCommand({
			Bucket: S3_BUCKET_NAME,
			Key: acuallocalPath
		});

		// Execute the command to delete the object
		const response = await s3Client.send(command);
		console.log('Object deleted:', response);
	},
	get_full: async (uri) => {
		const acuallocalPath = uri.substring(newVar.uriPrefix.length);
		const command = new GetObjectCommand({
			Bucket: S3_BUCKET_NAME,
			Key: acuallocalPath
		});

		const response = await s3Client.send(command);

		return Buffer.from(await response.Body.transformToByteArray());
	}
};
export default newVar;
