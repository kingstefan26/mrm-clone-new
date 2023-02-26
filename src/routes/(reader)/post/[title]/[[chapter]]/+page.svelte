<script lang="ts">
	import doublePageview from '$lib/shared/stores/doublepageview.js';
	import AddTheScriptThing from '$lib/shared/util/AddTheScriptThing';
	import { onMount } from 'svelte';
	import Dobulepage from './Dobulepage.svelte';
	import Singlepage from './Singlepage.svelte';

	/** @type {import('./$types').Data} */
	export let data;

	const BASE_URL = 'https://boney.kokoniara.software/api/asset/proxy/';

	onMount(() => {
		setTimeout(() => {
			navigator.sendBeacon(
				'/api/urmomtrics',
				JSON.stringify({
					postId: data.post.id,
					chapterIndex: data.current_chapter,
					type: 'view'
				})
			);
		}, 500 + Math.random() * 1000);
	});
</script>

<svelte:head>
	{#if data.post}
		<title>{data.post.title} - Mrm-clone</title>

		<!--{#if data.post.description}-->
		<meta name="description" content="Read {data.post.title} and other hot men on Mrmclone! " />
		<meta
			property="og:description"
			content="Read {data.post.title} and other hot men on Mrmclone!"
		/>
		<meta
			property="twitter:description"
			content="Read {data.post.title} and other hot men on Mrmclone!"
		/>
		<!--{/if}-->
		{#if data.post.posterAssetId}
			<meta property="twitter:image" content="{BASE_URL + data.post.posterAssetId}/image.jpg" />
			<meta property="og:image" content="{BASE_URL + data.post.posterAssetId}/image.jpg" />
			<meta property="twitter:card" content="{BASE_URL + data.post.posterAssetId}/image.jpg" />
		{/if}
		<meta name="title" content="{data.post.title}, read now on Mrm-clone" />
		<meta property="og:type" content="website" />
		<meta property="og:title" content="{data.post.title}, read now on Mrm-clone" />

		<meta property="twitter:title" content="{data.post.title}, read now on Mrm-clone" />
	{/if}

	<meta property="twitter:url" content="https://boney.kokoniara.software/" />

	{@html AddTheScriptThing({
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		headline: data.post.title,
		image: [BASE_URL + data.post.posterAssetId + '/image.jpg'],
		datePublished: data.post.createdAt,
		dateModified: data.post.updatedAt,
		author: [
			{
				'@type': 'Person',
				name: data.post.Author.name,
				url: '/search?q=' + data.post.Author.name
			}
		]
	})}
</svelte:head>

{#key data.post}
	{#if $doublePageview}
		<Dobulepage
			{doublePageview}
			chapter={data.post.chapters[0]}
			post={data.post}
			current_chapter={data.current_chapter}
		/>
	{:else}
		<Singlepage
			{doublePageview}
			chapter={data.post.chapters[0]}
			post={data.post}
			current_chapter={data.current_chapter}
			admin={data.admin}
		/>
	{/if}
{/key}
