<script>
	import '@material/web/progress/circular-progress.js';
	import '@material/web/button/filled-button.js';
	import postJson from '$lib/util.js';

	async function refreshSearchIndex() {
		loading = true;
		await postJson('/api/manage/search/updateSeachIndex', {});
		loading = false;
	}

	let loading = false;
</script>

<div>
	<md-filled-button on:click={refreshSearchIndex}> Recreate Search Index </md-filled-button>
	{#if loading}
		<md-circular-progress indeterminate></md-circular-progress>
	{/if}
	<h1 class="text-center text-4xl text-white">AAA</h1>
</div>
