import * as path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
import mime from 'mime-kind';
import type { StorageProvider } from '$lib/api/server/assets/AssetVersionManager';
import { Readable } from 'stream';

const newVar: StorageProvider = {
	name: 'localFs',
	uriPrefix: 'localFs://',
	create: async (arrayBuffer: ArrayBuffer) => {
		// create 'upload' dir if it doesn't exist
		const uploadDir = path.join(process.cwd(), './mrmNode/upload');

		// make sure dir exists
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}

		const uuid = crypto.randomUUID();

		let filePath = path.join(uploadDir, uuid);

		// create a new file in the upload dir
		const file = fs.createWriteStream(filePath, { flags: 'w' });
		file.write(arrayBuffer);
		file.end();
		// wait for the file to be written
		await new Promise((resolve) => file.on('finish', resolve));

		// create a sha1 etag using response body of res
		const etag = await crypto.subtle.digest('SHA-1', arrayBuffer);
		// convert to hex
		const etagHex = Array.from(new Uint8Array(etag))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');

		// get metadata
		const metadata = await sharp(filePath).metadata();

		const mimeType = (await mime(arrayBuffer)).mime;

		const uri = 'localFs://' + filePath;

		return {
			width: metadata.width,
			height: metadata.height,
			format: metadata.format,
			etag: etagHex,
			uri,
			mimeType
		};
	},
	// @ts-ignore
	get: (uri) => {
		const acuallocalPath = uri.substring('localFs://'.length);

		// check if file exists using fs module
		if (!fs.existsSync(acuallocalPath)) {
			return undefined;
		}

		return Readable.from(fs.createReadStream(acuallocalPath));
	},
	destroy: async (path: String) => {
		const realPath = path.substring('localFs://'.length);

		fs.rmSync(realPath);
	}
};
export default newVar;
