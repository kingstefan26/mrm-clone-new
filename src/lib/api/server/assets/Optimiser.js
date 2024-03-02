import imageminAvifenc from '@vheemstra/imagemin-avifenc';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminWebp from 'imagemin-webp';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminOptipng from 'imagemin-optipng';

/**
 * @typedef {Object} Optimiser
 * @property {string} mimeType
 * @property {(arrayBuffer: ArrayBuffer) => Promise<ArrayBuffer>} optimise
 */

/**
 * @type {Optimiser}
 */
export const AvifOptimiser = {
	mimeType: 'image/avif',
	optimise: async (arrayBuffer) => {
		return await imagemin.buffer(arrayBuffer, {
			plugins: [
				imageminAvifenc({
					depth: 10,
					yuv: 420,
					speed: 3,
					jobs: 'all',
					sharpyuv: true,
					advanced: {
						tune: 'ssim',
						sharpness: 2,
						'cq-level': 35,
						'color:sharpness': 1
					}
				})
			]
		});
	}
};

/**
 * @type {Optimiser}
 */
export const JpegOptimiser = {
	mimeType: 'image/jpeg',
	optimise: async (arrayBuffer) => {
		return await imagemin.buffer(arrayBuffer, {
			plugins: [
				imageminMozjpeg({
					tune: 'ssim',
					quality: 70
				})
			]
		});
	}
};

/**
 * @type {Optimiser}
 */
export const PngLosslessOptimiser = {
	mimeType: 'image/png',
	optimise: async (arrayBuffer) => {
		return await imagemin.buffer(arrayBuffer, {
			plugins: [
				imageminOptipng({
					quality: [0.6, 0.8]
				})
			]
		});
	}
};

/**
 * @type {Optimiser}
 */
export const JpegLosslessOptimer = {
	mimeType: 'image/jpeg',
	optimise: async (arrayBuffer) => {
		return await imagemin.buffer(arrayBuffer, {
			plugins: [
				imageminJpegtran({
					progressive: true
				})
			]
		});
	}
};

/**
 * @type {Optimiser}
 */
export const WebpOptimiser = {
	mimeType: 'image/webp',
	optimise: async (arrayBuffer) => {
		return await imagemin.buffer(arrayBuffer, {
			plugins: [
				imageminWebp({
					quality: 80
				})
			]
		});
	}
};
