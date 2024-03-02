<script>
	import Layout from '$lib/components/layout/readerLayout.svelte';
	import '../../app.css';

	import { onNavigate } from '$app/navigation';

	import {
		argbFromHex,
		themeFromSourceColor,
		applyTheme
	} from '@material/material-color-utilities';
	import { onMount } from 'svelte';

	// Get the theme from a hex color
	const theme = themeFromSourceColor(argbFromHex('#270828'));

	onMount(() => {
		// Check if the user has dark mode turned on
		const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		// Apply the theme to the body by updating custom properties for material tokens
		applyTheme(theme, { target: document.body, dark: systemDark });
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<Layout>
	<slot />
</Layout>

<style>
	@font-face {
		font-family: 'Material Symbols Outlined';
		font-style: normal;
		font-weight: 400;
		src: url(/fonts/MaterialSymbolsOutlined.woff2);
	}

	:root(.material-symbols-outlined) {
		font-family: 'Material Symbols Outlined';
		font-weight: normal;
		font-style: normal;
		font-size: 24px;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		display: inline-block;
		white-space: nowrap;
		word-wrap: normal;
		direction: ltr;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}

	:root::view-transition-old(root) {
		animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(root) {
		animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style>
