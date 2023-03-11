<script>
	import PostWidget from './PostWiget.svelte';
	import PostWigetSkeleton from './PostWigetSkeleton.svelte';

	export let data;
</script>

<svelte:head>
	<title>Mrm Home Page</title>
</svelte:head>

{#await data.stream.feed}
	<div class="content flex flex-wrap justify-center max-w-full">
		<div class="m-2" style="flex-basis: min-content;">
			<PostWigetSkeleton />
		</div>
		<div class="m-2" style="flex-basis: min-content;">
			<PostWigetSkeleton />
		</div>
		<div class="m-2" style="flex-basis: min-content;">
			<PostWigetSkeleton />
		</div>
	</div>
{:then feed}
	<div class="content flex flex-wrap justify-center max-w-full">
		{#if feed.posts.length < 0}
			no posts here 🤷
		{:else}
			{#each feed.posts as item}
				<div class="m-2" style="flex-basis: min-content;">
					<PostWidget post={item} />
				</div>
			{/each}
		{/if}
	</div>

	{#if feed.pagesAvalible > 1}
		<div class="flex">
			{#each [...Array(feed.pagesAvalible).keys()] as pageIndex}
				{pageIndex}
			{/each}
		</div>
	{/if}
{/await}
