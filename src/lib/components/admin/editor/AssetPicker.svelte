<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Popup from '$lib/components/popup/Popup.svelte';

	export let assetId;

	export let assetBucket = undefined;

	const dispatch = createEventDispatcher();

	async function recentlyUploadedAssets() {
		let options = {
			reason: 'getRecent'
		};

		if (assetBucket) options.bucketId = assetBucket;

		const res = await fetch('/api/asset/manage', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(options)
		});

		return (await res.json()).recentAssets;
	}

	let fileInput;

	function handleFilesChosen() {
		previewImages = [];

		for (const file of fileInput.files) {
			previewImages.push(URL.createObjectURL(file));
		}
	}

	let previewImages;

	const uploadAFile = (url, file, onProgress) =>
		new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.upload.addEventListener('progress', (e) => onProgress(e.loaded / e.total));
			xhr.addEventListener('load', () => resolve({ status: xhr.status, body: xhr.responseText }));
			xhr.addEventListener('error', () => reject(new Error('File upload failed')));
			xhr.addEventListener('abort', () => reject(new Error('File upload aborted')));
			xhr.open('POST', url, true);
			const formData = new FormData();
			formData.append('file', file);
			xhr.send(formData);
			// wait for the request to finish
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					resolve({ status: xhr.status, body: xhr.responseText });
				}
			};
		});

	async function uploadFiles() {
		step = 2;
		const curFiles = fileInput.files;

		// for every file upload in curFiles upload it in parallel
		const promises = Array.from(curFiles).map((file, index) => {
			return uploadAFile('/api/asset/upload', file, (progress) => {
				uploadProgress[index] = progress;
			});
		});

		const res = await Promise.all(promises);
		console.log(res);
		// confim page with the new assets
		const asset0 = JSON.parse(res[0].body);
		console.log(asset0);
		confirmPage(asset0.asset);
	}

	let uploadProgress = [0];

	function closePopup() {
		expanded = false;
		newAssset = undefined;
		step = 0;
	}

	export let expanded = false;

	function confirmPage(asset) {
		newAssset = asset;
		step = 3;
	}

	let newAssset;

	let step = 0;

	function confirmNewAsset() {
		console.log('calling assetpicked with', newAssset);
		const asset = structuredClone(newAssset);
		closePopup();
		dispatch('assetpicked', {
			newAsset: asset
		});
	}
</script>

{#if assetId}
	<img
		class="w-[150px] h-[260px] object-cover m-1"
		on:click={() => {
			expanded = !expanded;
		}}
		src="/api/asset/proxy/{assetId}"
		alt="Asset #{assetId}"
	/>
{:else}
	<div
		class="w-[150px] h-[260px]"
		on:click={() => {
			expanded = !expanded;
		}}
	/>
{/if}

<Popup {expanded}>
	<svelte:fragment slot="content">
		{#if step === 0}
			<div class="multipagePage">
				Editing Asset
				{#if assetId}
					<img class="object-contain w-[150px] h-[200px]" src="/api/asset/proxy/{assetId}" alt="" />
				{/if}

				<h1>Recently added Assets</h1>
				{#await recentlyUploadedAssets()}
					<h1>Loading Recent assets</h1>
				{:then assets}
					<div class="flex flex-wrap gap-2 overflow-scroll">
						{#each assets as asset}
							<button
								on:click={() => {
									confirmPage(asset);
								}}
								class=" max-w-[100px] h-[150px]"
							>
								<img src="/api/asset/proxy/{asset.id}" class="object-fill" alt="" />
							</button>
						{/each}
					</div>
				{/await}
				<h1>
					<button
						class="button"
						on:click={() => {
							step = 1;
						}}
					>
						Or create a new one
					</button>
				</h1>
			</div>
		{/if}

		{#if step === 1}
			<div class="multipagePage">
				<button
					class="button"
					on:click={() => {
						step = 0;
					}}
				>
					⬅
				</button>
				<input
					on:change={handleFilesChosen}
					accept=".jpg, .jpeg, .png .avif .jxl"
					style="display: none"
					type="file"
					bind:this={fileInput}
					multiple
				/>
				<button
					on:click={() => {
						fileInput.click();
					}}
				>
					<h1>Pick files</h1>
				</button>

				{#if previewImages}
					{#each previewImages as previewImage}
						<img src={previewImage} class="w-[150px] h-[200px]" alt="" />
					{/each}
					<button
						class="button"
						on:click={() => {
							uploadFiles();
						}}
					>
						Upload!
					</button>
				{/if}
			</div>
		{/if}

		{#if step === 2}
			<div class="multipagePage">
				<button
					class="button"
					on:click={() => {
						step = 0;
					}}
				>
					⬅
				</button>
				UPLOADING ASSET[S]
				{#each uploadProgress as progress}
					<div class="progress-bar">
						<div class="progress-bar__fill" style="width: {progress * 100}%" />
					</div>
				{/each}
			</div>
		{/if}

		{#if step === 3}
			<div class="multipagePage">
				<button
					class="button"
					on:click={() => {
						step = 0;
					}}
				>
					⬅
				</button>
				CONFIRM ASSET

				<button
					class="button float-right"
					on:click={() => {
						confirmNewAsset();
					}}
				>
					✅
				</button>
				<img
					class="object-contain max-w-[300px] max-h-[400px]"
					src="/api/asset/proxy/{newAssset.id}"
					alt=""
				/>
				<a href="/api/asset/proxy/{newAssset.id}" target="_blank" class="underline">FULL PREVIEW</a>
			</div>
		{/if}
	</svelte:fragment>
</Popup>

<style>
	.progress-bar {
		width: 100%;
		height: 20px;
		background-color: #eee;
		border-radius: 5px;
		overflow: hidden;
	}

	.progress-bar__fill {
		height: 100%;
		background-color: #4caf50;
		transition: width 0.2s ease-in-out;
	}

	.button {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 13px;
		padding: 5px 10px;
		border: 1px solid #aaa;
		background-color: #eee;
		background-image: linear-gradient(top, #fff, #f0f0f0);
		border-radius: 2px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
		color: #666;
		text-decoration: none;
		text-shadow: 0 1px 0 #fff;
		cursor: pointer;
		transition: all 0.2s ease-out;
	}

	.multipagePage {
		grid-area: 1/1/2/2;
	}
</style>
