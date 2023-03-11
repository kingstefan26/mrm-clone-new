import imageminAvifenc from '@vheemstra/imagemin-avifenc';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminWebp from 'imagemin-webp';
import imagemin from 'imagemin';

type Optimiser = {
	optimise: (arrayBuffer: ArrayBuffer) => Promise<ArrayBuffer>;
	mimeType: string;
};

export const AvifOptimiser: Optimiser = {
	mimeType: 'image/avif',
	optimise: async (arrayBuffer: ArrayBuffer) => {
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

export const JpegOptimiser: Optimiser = {
	mimeType: 'image/jpeg',
	optimise: async (arrayBuffer: ArrayBuffer) => {
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

export const WebpOptimiser: Optimiser = {
	mimeType: 'image/webp',
	optimise: async (arrayBuffer: ArrayBuffer) => {
		return await imagemin.buffer(arrayBuffer, {
			plugins: [
				imageminWebp({
					quality: 80
				})
			]
		});
	}
};
