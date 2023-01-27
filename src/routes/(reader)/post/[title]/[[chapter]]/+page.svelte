<script>
    import Dobulepage from "$lib/components/reader/dobulepage.svelte";
    import Singlepage from "$lib/components/reader/singlepageview.svelte";
    import doublePageview from "$lib/shared/stores/doublepageview.js";

    /** @type {import('./$types').Data} */
    export let data;

    let { current_chapter, post } = data;
    let chapter
    $: (
        { current_chapter, post } = data
    )

    $: {
        chapter = post.chapters[0]
    }

    const BASE_URL = "https://boney.kokoniara.software/api/asset/proxy/";
</script>


<svelte:head>

    {#if post}
        <title>{post.title} - Mrm-clone</title>
        {#if post.description}
            <meta name="description" content="{post.description}">
            <meta property="og:description" content="{post.description}">
            <meta property="twitter:description" content="{post.description}">
        {/if}
        {#if post.posterAssetId}
            <meta property="twitter:image" content="{BASE_URL + post.posterAssetId}">
            <meta property="og:image" content="{BASE_URL + post.posterAssetId}">
            <meta property="twitter:card" content="{BASE_URL + post.posterAssetId}">
        {/if}
        <meta name="title" content="{post.title}, read now on Mrm-clone">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{post.title}, read now on Mrm-clone">

        <meta property="twitter:title" content="{post.title}, read now on Mrm-clone">
    {/if}

    <meta property="twitter:url" content="https://boney.kokoniara.software/">
</svelte:head>

{#if post}
    {#if $doublePageview}
        <Dobulepage {doublePageview} {chapter} {post} {current_chapter} />
    {:else }
        <Singlepage {doublePageview} {chapter} {post} {current_chapter} />
    {/if}
{/if}

