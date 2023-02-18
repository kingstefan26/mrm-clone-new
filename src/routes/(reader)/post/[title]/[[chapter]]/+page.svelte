<script>
	import doublePageview from '$lib/shared/stores/doublepageview.js';
	import AddTheScriptThing from '$lib/shared/util/AddTheScriptThing';
	import { onMount } from 'svelte';
	import Dobulepage from './Dobulepage.svelte';
	import Singlepage from './Singlepage.svelte';

	/** @type {import('./$types').Data} */
	export let data;

	let { current_chapter, post } = data;
	let chapter;
	$: ({ current_chapter, post } = data);

	$: {
		chapter = post.chapters[0];
	}

	const BASE_URL = 'https://boney.kokoniara.software/api/asset/proxy/';

	onMount(() => {
		setTimeout(() => {
			navigator.sendBeacon(
				'/api/urmomtrics',
				JSON.stringify({
					postId: post.id,
					chapterIndex: current_chapter,
					type: 'view'
				})
			);
		}, 500 + Math.random() * 1000);
	});
</script>

<svelte:head>
	{#if post}
		<title>{post.title} - Mrm-clone</title>

		{#if post.description}
			<meta name="description" content={post.description} />
			<meta property="og:description" content={post.description} />
			<meta property="twitter:description" content={post.description} />
		{/if}
		{#if post.posterAssetId}
			<meta property="twitter:image" content="{BASE_URL + post.posterAssetId}/image.jpg" />
			<meta property="og:image" content="{BASE_URL + post.posterAssetId}/image.jpg" />
			<meta property="twitter:card" content="{BASE_URL + post.posterAssetId}/image.jpg" />
		{/if}
		<meta name="title" content="{post.title}, read now on Mrm-clone" />
		<meta property="og:type" content="website" />
		<meta property="og:title" content="{post.title}, read now on Mrm-clone" />

		<meta property="twitter:title" content="{post.title}, read now on Mrm-clone" />
	{/if}

	<meta property="twitter:url" content="https://boney.kokoniara.software/" />

	{@html AddTheScriptThing({
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		headline: post.title,
		image: [BASE_URL + post.posterAssetId + '/image.jpg'],
		datePublished: post.createdAt,
		dateModified: post.updatedAt,
		author: [
			{
				'@type': 'Person',
				name: post.Author.name,
				url: '/search?q=' + post.Author.name
			}
		]
	})}
</svelte:head>

{#if post}
	{#if $doublePageview}
		<Dobulepage {doublePageview} {chapter} {post} {current_chapter} />
	{:else}
		<Singlepage {doublePageview} {chapter} {post} {current_chapter} />
	{/if}
{/if}
