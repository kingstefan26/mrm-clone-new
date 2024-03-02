<script>
	import '@material/web/textfield/outlined-text-field.js';
	import '@material/web/textfield/filled-text-field.js';
	import '@material/web/icon/icon.js';
	import '@material/web/progress/circular-progress.js';
	import { createEventDispatcher } from 'svelte';

	export let name;
	export let attribute;

	$: {
		if (!attribute) {
			attribute = '';
		}
	}

	export let multiline = false;

	export let loading = false;

	const dispatch = createEventDispatcher();

	function forward() {
		dispatch('save', {
			attribute
		});
		sync_status = 2;
	}

	let element;

	let sync_status = 2;

	let timer;
	let timeoutVal = 1000;

	function handleKeyPress() {
		window.clearTimeout(timer);
		sync_status = 0;
	}

	function handleKeyUp() {
		window.clearTimeout(timer);
		timer = window.setTimeout(() => {
			console.log('Pushing Changes');
			sync_status = 1;
			attribute = element.value;
			forward();
		}, timeoutVal);
	}
</script>

<div>
	{#if multiline}
		<md-outlined-text-field
			type="textarea"
			disabled={loading}
			value={attribute}
			on:keypress={handleKeyPress}
			on:keyup={handleKeyUp}
			bind:this={element}
			rows="3"
			label={name}
		/>
	{:else}
		<md-outlined-text-field
			disabled={loading}
			value={attribute}
			on:keypress={handleKeyPress}
			on:keyup={handleKeyUp}
			bind:this={element}
			label={name}
		/>
	{/if}

	{#if sync_status === 0}
		<span class="material-symbols-outlined select-none">sync</span>
	{:else if sync_status === 1}
		<md-circular-progress indeterminate />
	{:else if sync_status === 2}
		<span class="material-symbols-outlined select-none">cloud_done</span>
	{/if}
</div>

<style>
	md-outlined-text-field {
		resize: vertical;
	}
</style>
