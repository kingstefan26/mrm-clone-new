<script>
    import PostWidget from "$lib/components/feed/PostWiget.svelte";

    export let data;

</script>

<svelte:head>
    <title>Mrm Home Page</title>
</svelte:head>


<div class="content flex flex-wrap justify-center max-w-full">
    {#if data.feed.posts.length < 0}
        no posts here 🤷
    {:else}
        {#each data.feed.posts as item}
            <div class="m-2" style="flex-basis: min-content;">
                <PostWidget post={item}/>
            </div>
        {/each}
    {/if}
</div>


{#if data.feed.pagesAvalible > 1}
    <div class="flex">
        {#each [...Array(data.feed.pagesAvalible).keys()] as pageIndex}
            {pageIndex}
        {/each}
    </div>
{/if}