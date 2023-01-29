<script>
    import Layout from '$lib/components/layout/readerLayout.svelte';
    import { page } from '$app/stores';
</script>



<svelte:head>
    {#if $page.status === 404}
        <meta name="robots" content="noindex">
        <title>404 - Page not found</title>
        {:else}
        <title>Something went wrong</title>
    {/if}


</svelte:head>

<Layout>
    <h1 style="color: black">{$page.error.message}</h1>
</Layout>