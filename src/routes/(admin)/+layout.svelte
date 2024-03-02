<script>
	import '../../app.css';

	import {
		argbFromHex,
		themeFromSourceColor,
		applyTheme
	} from '@material/material-color-utilities';
	import { onMount } from 'svelte';

	// Get the theme from a hex color
	const theme = themeFromSourceColor(argbFromHex('#968282'));

	onMount(() => {
		// Check if the user has dark mode turned on
		const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		// Apply the theme to the body by updating custom properties for material tokens
		applyTheme(theme, { target: document.body, dark: systemDark });
	});
</script>

<slot />
