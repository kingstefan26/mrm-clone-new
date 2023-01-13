<!-- http://localhost:1337/api/posts?filters[title][$eq]=City%20Boy%20to%20Seto%20no%20Shima%203&populate=chapters,localizations,chapter_media-->
<script>
    import Dobulepage from "./dobulepage.svelte";
    import Singlepage from "./singlepageview.svelte";
    import doublePageview from "$lib/shared/stores/doublepageview.js";

    /** @type {import('./$types').Data} */
    export let data;

    let { current_chapter, chapter, meta } = data;
    $: (
        { current_chapter, chapter, meta } = data
    )

    const BASE_URL = "yes";
</script>


<svelte:head>
    {#if meta}
        <title>{meta.title} - Mrm-clone</title>
        {#if meta.description}
            <meta name="description" content="{meta.description}">
            <meta property="og:description" content="{meta.description}">
            <meta property="twitter:description" content="{meta.description}">
        {/if}
        {#if meta.poster}
            <meta property="twitter:image" content="{BASE_URL + meta.poster.path}">
            <meta property="og:image" content="{BASE_URL + meta.poster.path}">
            <meta property="twitter:card" content="{BASE_URL + meta.poster.path}">
        {/if}
        <meta name="title" content="{meta.title}, read now on Mrm-clone">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{meta.title}, read now on Mrm-clone">

        <meta property="twitter:title" content="{meta.title}, read now on Mrm-clone">
    {/if}

    <meta property="twitter:url" content="https://mrm-clone.vercel.app/">

</svelte:head>

{#if meta}
    <!--{#if ($doublePageview)}-->
<!--        <Dobulepage {doublePageview} {fetchchapter} {post} {getImage} />-->
<!--    {:else }-->
        <Singlepage {doublePageview} {chapter} {meta} {current_chapter} />
    <!--{/if}-->
{/if}

