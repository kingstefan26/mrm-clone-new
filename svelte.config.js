// import adapter from '@sveltejs/adapter-cloudflare';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import cspDirectives from './csp-directives.mjs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			precompress: true
		}),
		csp: {
			mode: 'hash',
			directives: cspDirectives
		}
	},
	preprocess: vitePreprocess()
};

export default config;
