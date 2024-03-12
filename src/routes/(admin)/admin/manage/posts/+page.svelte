<script>
	import '@material/web/button/filled-button.js';
	import '@material/web/fab/fab.js';
	import { goto } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div>
	<div class="flex flex-wrap justify-center gap-2 mb-4">
		{#each data.posts as post}
			<a href="/admin/manage/posts/edit/{post.id}" class="w-[10rem] h-[15rem]">
				{post.title}
				{post.Author.name}

				<img
					class="h-[80%] object-cover"
					alt="Poster for {post.title}"
					src="/api/asset/proxy/{post.posterAssetId}"
				/>
			</a>
		{/each}
	</div>

	<md-fab
		class="fixed bottom-10 right-12"
		on:click={() => {
			goto('/admin/manage/posts/create');
		}}
	>
		<span slot="icon" class="material-symbols-outlined"> add </span>
	</md-fab>
</div>
