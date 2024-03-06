<script>
	import { fly } from 'svelte/transition';
	export let pathname = '';
</script>

{#key pathname}
	<div in:fly|global={{ y: 10, duration: 300, delay: 200 }}>
		<slot />
	</div>
{/key}
