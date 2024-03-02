<script>
	import { fly } from 'svelte/transition';
	import { hashCode, transision_hashcode } from '$lib/api/string-hashcode.js';
	export let post = {
		id: '',
		title: '',
		posterAssetId: '',
		chapter_count: 0,
		Author: {
			name: ''
		},
		lang: []
	};

	export let link = `/post/${post.id}`;

	let posterPath = `/api/asset/proxy/${post.posterAssetId}`;

	let page_transisiton_id = transision_hashcode(hashCode(post.title));

	export let showTags = true;
</script>

<article in:fly={{ y: 10, duration: 200, delay: 50 }} class="wrapper text-center">
	<div class="thehead grid h-24">
		<div>
			<a class="title_link w-full h-full" data-sveltekit-preload-data="hover" href={link}>
				<h2
					class="font-bold max-h-full overflow-ellipsis overflow-hidden whitespace-break-spaces max-w-full"
				>
					{post.title}
				</h2>
			</a>
		</div>
		<p class="about_text m-auto font-light">
			{#if post.lang}
				[{post.lang.toUpperCase()}]
			{/if}
			{#if post.Author}
				<a class="author_link no-underline" href="/search?author={post.Author.name}"
					>[{post.Author.name}]</a
				>
			{/if}
		</p>
	</div>

	<div>
		<a data-sveltekit-preload-data class="center no-underline w-[180px] h-[260px]" href={link}>
			<img
				alt="Poster for {post.title}"
				src={posterPath}
				class="object-cover"
				style="background: rgb(96, 96, 96); view-transition-name: poster-{page_transisiton_id}"
				height="260"
				width="180"
			/>
		</a>
		{#if post.chapter_count > 1 && showTags}
			<div class="flex flex-wrap justify-center max-w-full">
				<!--weird trick to make a 'range' in js-->
				{#each [...Array(post.chapter_count).keys()] as chapter}
					<a class="chapter_link pl-0.5 pr-0.5 font-light" href="/post/{post.id}/{chapter}"
						>{chapter}</a
					>
				{/each}
			</div>
		{:else}
			<br />
		{/if}
	</div>
</article>

<style>
	.about_text {
		color: #929292;
		font-family: helvetica neue, Helvetica, Arial, sans-serif;
	}

	.title_link:hover > h2 {
		transition: 0.2s;
		color: #6eb9df;
	}

	.chapter_link {
		color: #4992af;
	}

	.author_link:hover {
		transition: 0.2s;
		color: #6eb9df;
	}

	.thehead {
		/*height: 70px;*/
		grid-auto-rows: 50% 50%;
	}

	h2 {
		font-family: helvetica neue, Helvetica, Arial, sans-serif;
		color: #c9c9c9;
	}

	.wrapper {
		/*width: max-content;*/
		/*height: max-content;*/

		max-width: 180px;
		max-height: 400px;

		flex: 1 1 auto;

		/*background-color: rgb(68, 68, 68);*/
		border-radius: 10px;
		/*border: 1px red solid;*/
		border-bottom: 100px;
	}

	.center {
		max-width: 100%;
		display: flex;
		justify-content: center;
	}

	a {
		text-decoration: none;
	}

	::view-transition-old(poster),
	::view-transition-new(poster) {
		/* Prevent the default animation,
    so both views remain opacity:1 throughout the transition */
		animation: none;
		/* Use normal blending,
    so the new view sits on top and obscures the old view */
		mix-blend-mode: normal;
		/* Make the height the same as the group,
    meaning the view size might not match its aspect-ratio. */
		height: 100%;
		/* Clip any overflow of the view */
		overflow: clip;
	}

	/* The old view is the thumbnail */
	::view-transition-old(poster) {
		/* Maintain the aspect ratio of the view,
    by shrinking it to fit within the bounds of the element */
		object-fit: contain;
	}

	/* The new view is the full image */
	::view-transition-new(poster) {
		/* Maintain the aspect ratio of the view,
    by growing it to cover the bounds of the element */
		object-fit: cover;
	}
</style>
