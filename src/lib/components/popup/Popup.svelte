<script>
	import { fade, fly } from 'svelte/transition';
	import '@material/web/dialog/dialog.js';

	export let expanded = false;

	function closePopup() {
		expanded = false;
	}

	let dialog;
	$: if (dialog) {
		if (expanded) {
			expanded = true;
			dialog.show();
		}

		if (!expanded) {
			expanded = false;
			dialog.close();
		}
	}

	function closedDialog() {
		expanded = false;
	}
</script>

<slot name="alwaysVisible" />

<md-dialog bind:this={dialog} on:close={closedDialog}>
	<div name="headline">
		<slot name="headline" />
	</div>
	<div
		class="multipageContainer"
		slot="content"
		in:fly={{ y: 10, duration: 100 }}
		out:fade={{ duration: 200 }}
	>
		<div class="flex mb-1">
			<button
				class="button rounded-none bg-stone-500 px-2 py-0 hover:bg-stone-600 hover:transition-colors"
				on:click={closePopup}
			>
				Close
			</button>
			<div class="text-xl ml-2 min-w-fit">
				<slot name="header" />
			</div>
		</div>

		<div class="adasdwad">
			<slot name="content" />
		</div>
	</div>
</md-dialog>

<style>
	.adasdwad {
		grid-column: span 2;
	}
	.multipageContainer {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto;
		align-items: start;
	}
</style>
