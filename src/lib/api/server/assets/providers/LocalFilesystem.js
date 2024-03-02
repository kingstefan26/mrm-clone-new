import * as path from 'path';
import * as fs from 'fs';
import { Readable } from 'stream';

/**
 * @typedef {import('../AssetVersionManager.js').StorageProvider} StorageProvider
 * @type StorageProvider
 */
const newVar = {
	name: 'localFs',
	uriPrefix: 'localFs://',
	create: async (arrayBuffer) => {
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

		const uri = 'localFs://' + filePath;

		return {
			uri
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
	get_http_url: (uri) => {
		return undefined; // not supported on local filesystem
	},
	get_full: async (uri) => {
		// return buffer
		const acuallocalPath = uri.substring('localFs://'.length);

		// check if file exists using fs module
		if (!fs.existsSync(acuallocalPath)) {
			return undefined;
		}

		return fs.readFileSync(acuallocalPath);
	},
	destroy: async (path) => {
		const realPath = path.substring('localFs://'.length);

		fs.rmSync(realPath);
	}
};
export default newVar;
