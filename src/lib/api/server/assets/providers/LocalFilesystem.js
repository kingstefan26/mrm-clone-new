import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { execSync } from 'child_process';

function getMimeFromPath(filePath) {
	const mimeType = execSync(`file --mime-type -b "${filePath}"`).toString();

	return mimeType.trim();
}

export const definition = {
	name: 'localFs',
	uriPrefix: 'localFs://',
	create: async (arrayBuffer) => {
		// create 'upload' dir if it doesn't exist
		const uploadDir = path.join(process.cwd(), './mrmNode/upload');

		// make sure dir exists
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}

		// generate a random uuid
		const uuid =
			Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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

		const mimeType = getMimeFromPath(filePath);

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
	get: async (uri) => {
		const acuallocalPath = uri.substring('localFs://'.length);

		// check if file exists using fs module
		if (!fs.existsSync(acuallocalPath)) {
			return undefined;
		}

		// read from file system using fs module
		return fs.createReadStream(acuallocalPath);
	},
	destroy: async (path) => {
		const realPath = path.substring('localFs://'.length);

		fs.rmSync(realPath);
	}
};
