<script>
	import { lazyLoad } from '$lib/shared/util/LazyLoad';
	import '@material/web/iconbutton/icon-button.js';
	import '@material/web/icon/icon.js';
	import '@material/web/divider/divider.js';
	import { hashCode, transision_hashcode } from '$lib/api/string-hashcode.js';
	import { goto } from '$app/navigation';

	export let chapter;
	export let post;
	export let current_chapter;
	export let admin;

	function formatTime(unixTimeStamp) {
		const a = new Date(unixTimeStamp);
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];
		return `${a.getDate()} ${months[a.getMonth()]} ${a.getFullYear()}`;
	}

	const chapterLink = (index) => `/post/${post.id}/${index}`;
	let langOverride = '';

	let page_transisiton_id = transision_hashcode(hashCode(post.title));
</script>

<div class="mx-auto max-w-[1020px]">
	<div class="mr-2 ml-2 grid grid-rows-2">
		<div class="grid grid-cols-[1fr,auto]">
			<h1 class="title font-publicsans">
				{#if !post.Author}
					<a href="/search?artist=annon" class="title_author font-publicsans"> [N/A] </a>
				{:else}
					<a href="/search?artist={post.Author.name}" class="title_author font-publicsans">
						[{post.Author.name}]
					</a>
				{/if}
				<span style="view-transition-name: post-title-reader">
					{post.title}
				</span>
			</h1>
			<div>
				<md-icon-button
					class="relative font-publicsans"
					on:click={() => {
						goto(`/post/${post.id}/reader/0`);
					}}
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							goto(`/post/${post.id}/reader/0`);
						}
					}}
					on:keyup={(e) => {
						if (e.key === 'Enter') {
							goto(`/post/${post.id}/reader/0`);
						}
					}}
					aria-label="Toggle Reader Mode"
					title="Toggle Reader Mode"
				>
					<md-icon>menu_book</md-icon>
				</md-icon-button>
				{#if admin}
					<md-icon-button
						class="relative font-publicsans"
						href="/admin/manage/posts/edit/{post.id}"
						title="Edit this post"
					>
						<md-icon>edit</md-icon>
					</md-icon-button>
				{/if}
			</div>
		</div>

		<div>
			<time class="creation" datetime={new Date(post.createdAt)}>
				{formatTime(post.createdAt)}
			</time>

			<div class="tags">
				{#if post.tags.length !== 0}
					Tags:
					{#each post.tags as tag}
						<a class="tag" href="/search?tag={tag.name}">{tag.name} </a>
					{/each}
				{/if}
			</div>

			<div class="tags">
				{#if post.generes}
					{#if post.generes.length !== 0}
						Genres:
						{#each post.generes as tag}
							<a class="tag" href="/search?genre={tag.name}">{tag.name} </a>
						{/each}
					{/if}
				{/if}
			</div>

			<div class="tags">
				{#if post.languages}
					{#if post.languages.length > 1}
						Available in:
						{#each post.languages as lang}
							<!-- button that will change langOverride variable to lang -->
							<button
								class="tag"
								on:click={() => {
									langOverride = `?lang=${lang}`;
								}}
							>
								{lang}
							</button>
						{/each}
					{/if}
				{/if}
			</div>

			<div class="tags">
				{#if post.categories}
					{#if post.categories.length !== 0}
						Categories:
						{#each post.categories as tag}
							<a class="tag" href="/search?category={tag.name}">{tag.name} </a>
						{/each}
					{/if}
				{/if}
			</div>

			{#if post.seriesCount}
				<div class="tags">
					This Post is a part of the series, links to parts:
					{#each post.seriesLinks as link, index}
						<a href="/post/{link.id}" class="tag">{index + 1}</a>
					{/each}
				</div>
			{/if}

			{#if current_chapter > 0}
				<p class="font-bold mr-2" style="color: #a2a2a2;">
					Chapter: #{current_chapter}
				</p>
			{/if}

			{#if post.description}
				<p class="tags">{post.description}</p>
			{/if}
		</div>
	</div>

	<md-divider inset class="mb-3" />

	<!--	<PageTransision pathname={current_chapter}	>-->
	{#each chapter.assets as asset}
		{#if asset.indexInChapter === 0}
			<!-- First image should not lazyload as it is the LCP-->
			<img
				class="h-auto w-full"
				src="/api/asset/proxy/{asset.id}{langOverride}"
				alt={asset.indexInChapter}
				loading="eager"
				fetchpriority="high"
				height={asset.height}
				width={asset.width}
				style="view-transition-name: poster-{page_transisiton_id}"
			/>
		{:else}
			<img
				use:lazyLoad={`/api/asset/proxy/${asset.id}${langOverride}`}
				class="pusle_anim h-auto w-full"
				alt={asset.indexInChapter}
				height={asset.height}
				width={asset.width}
				loading="eager"
				fetchpriority="high"
				src=""
			/>
		{/if}
	{/each}
	<!--	</PageTransision>-->

	{#if post.chapterCount > 1}
		<div id="linkwrapper">
			{#if current_chapter - 1 >= 0}
				<a href={chapterLink(current_chapter - 1)}>« Previous</a>
			{/if}

			{#each [...Array(post.chapterCount).keys()] as chapter, index}
				<a href={chapterLink(index)} class={index === current_chapter ? 'iamselected' : ''}
					>{index}</a
				>
			{/each}

			{#if current_chapter + 1 < post.chapterCount}
				<a href="{chapterLink(current_chapter + 1)} ">Next »</a>
			{/if}
		</div>
	{/if}
</div>

<style>
	img {
		color: white;
	}

	.title {
		margin-top: 10px;
		font-weight: 900;
		font-size: 2em;
		color: #c5c4c4;
	}

	.tags {
		color: #a2a2a2;
		margin: 0 0 5px;
	}

	.tag {
		color: #5fb0e1;
		margin-left: 2px;
		margin-right: 2px;
		text-decoration: none;
	}

	.tag:hover {
		text-decoration: underline;
		color: #9dcef1;
		transition: 0.1s;
	}

	.title_author {
		color: #a2a2a2;
		font-family: 'Public Sans', sans-serif;
		font-weight: 800;
	}

	.title_author:hover {
		color: #b6b6b6;
	}

	.creation {
		font-family: 'Public Sans', sans-serif;
		color: #ababab;
	}

	#linkwrapper * {
		background-color: #333;
		border-radius: 3px;
		cursor: pointer;
		display: inline-block;
		color: #70bce2;
		padding: 6px;
		font-weight: 400;
		margin: 0 4px;
		font-size: 1.6rem;
	}

	#linkwrapper {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
	}

	.pusle_anim {
		animation: loading-animation 2s ease-in-out infinite;
		background-color: #343434;
		background-repeat: no-repeat;
		background-image: linear-gradient(90deg, #343434, #505050, #343434);
	}

	@keyframes loading-animation {
		0% {
			background-position: -1000px 0;
		}
		100% {
			background-position: calc(1000px + 100%) 0;
		}
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
