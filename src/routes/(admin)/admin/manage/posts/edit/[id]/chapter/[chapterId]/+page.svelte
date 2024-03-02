<script>
	import EditableAtribute from '$lib/components/admin/editor/editableAtribute.svelte';
	import EditibleCheckMark from '$lib/components/admin/editor/EditibleCheckMark.svelte';
	import { goto } from '$app/navigation';
	import AssetPicker from '$lib/components/admin/editor/AssetPicker.svelte';
	import { sendManageRequest } from '$lib/shared/util/ClientRestClient.js';

	export let data;

	let hovering = false;

	const drop = (event, target) => {
		event.dataTransfer.dropEffect = 'move';
		const start = parseInt(event.dataTransfer.getData('text/plain'));
		const newTracklist = data.chapter.assets;

		if (start < target) {
			newTracklist.splice(target + 1, 0, newTracklist[start]);
			newTracklist.splice(start, 1);
		} else {
			newTracklist.splice(target, 0, newTracklist[start]);
			newTracklist.splice(start + 1, 1);
		}
		data.chapter.assets = newTracklist;

		alert('changes in chapter order are not saved yet');
		hovering = null;
	};

	const dragstart = (event, i) => {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.dropEffect = 'move';
		const start = i;
		event.dataTransfer.setData('text/plain', start);
	};
	let updatingServer = false;

	async function pushChapterData() {
		updatingServer = true;

		await sendManageRequest('/post/updatechapter', {
			chapterId: data.chapter.id,
			name: data.chapter.name,
			published: data.chapter.published,
			western: data.chapter.western,
			sensitiveContent: data.chapter.sensitiveContent
		});

		updatingServer = false;
	}

	async function deleteChapter() {
		await sendManageRequest('/post/deletechapter', {
			chapterId: data.chapter.id
		});

		goto('/admin/manage/posts/edit/' + data.chapter.postId);
	}

	async function updateChapterAssets() {
		const { data } = await sendManageRequest('/post/updateChapterAssets', {
			chapterId: data.chapter.id,
			assets: data.chapter.assets
		});

		data.chapter = data.chapter;
	}

	async function changeAsset(oldAssetIndexInChapter, oldAsset, event) {
		const { asset } = event.detail;

		data.chapter.assets[oldAssetIndexInChapter] = asset;

		await updateChapterAssets();
	}

	async function addAsset(event) {
		const maxAssetIndex = Math.max(...data.chapter.assets.map((asset) => asset.indexInParentPost));
		event.detail.newAsset.indexInParentPost = maxAssetIndex + 1;
		data.chapter.assets.push(event.detail.newAsset);
		await updateChapterAssets();
	}
</script>

<svelte:head>
	<title>Editing Chapter</title>
</svelte:head>

<div class="bg-stone-600 max-w-full">
	<div class="w-full h-min flex">
		<button
			on:click={goto('/admin/manage/posts/edit/' + data.chapter.postId)}
			class="bg-stone-500 hover:bg-stone-700 text-white font-bold px-4"
		>
			Go Back
		</button>
		<h1 class="text-white text-xl font-bold w-5/6 text-center">Editing Chapter</h1>
		<button
			on:click={deleteChapter}
			class="bg-stone-500 hover:bg-stone-700 text-white font-bold px-4"
		>
			Delete Chapter
		</button>
	</div>

	<div class="grid grid-cols-[auto,1fr]">
		<EditableAtribute
			on:save={pushChapterData}
			bind:loading={updatingServer}
			bind:attribute={data.chapter.name}
			name="Chapter Name"
		/>
		<div>
			<EditibleCheckMark
				on:save={({ detail }) => {
					data.chapter.published = detail.checked;
					pushChapterData();
				}}
				bind:loading={updatingServer}
				name="Published"
				checked={data.chapter.published}
			/>
			<EditibleCheckMark
				on:save={({ detail }) => {
					data.chapter.western = detail.checked;
					pushChapterData();
				}}
				bind:loading={updatingServer}
				name="Western"
				checked={data.chapter.western}
			/>
			<EditibleCheckMark
				on:save={({ detail }) => {
					data.chapter.sensitiveContent = detail.checked;
					pushChapterData();
				}}
				bind:loading={updatingServer}
				name="Contains Sensitive Content"
				checked={data.chapter.sensitiveContent}
			/>
		</div>
	</div>

	<h1 class="text-center text-white text-xl font-bold">Edit Media</h1>

	<div class="flex flex-wrap list">
		{#each data.chapter.assets as asset, index (asset.id)}
			<div
				class="list-item"
				draggable="true"
				on:dragstart={(event) => dragstart(event, index)}
				on:drop|preventDefault={(event) => drop(event, index)}
				ondragover="return false"
				on:dragenter={() => (hovering = index)}
				class:is-active={hovering === index}
			>
				<AssetPicker
					on:assetpicked={(event) => {
						changeAsset(index, asset, event);
					}}
					assetId={asset.id}
				/>
			</div>
		{/each}
		<div class="list-item">
			<p class="">Create New Asset</p>

			<AssetPicker on:assetpicked={addAsset} />
		</div>
	</div>
</div>

<style>
	.list {
		border-radius: 4px;
		box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
	}

	.list-item {
		display: block;
		padding: 0.5em 1em;
	}

	.list-item:not(:last-child) {
		border-bottom: 1px solid #dbdbdb;
	}

	.list-item.is-active {
		background-color: #3273dc;
		color: #fff;
	}
</style>
