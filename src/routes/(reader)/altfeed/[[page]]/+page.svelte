<script>
    import PostWidget from "$lib/components/feed/PostWiget.svelte";

    import {invalidate} from '$app/navigation';

    // import PostWigetSkeleton from "$lib/components/feed/PostWigetSkeleton.svelte";
    // import {navigating} from "$app/stores";

    export let data;
    let feed = data.feed;

</script>

<svelte:head>
    <title>AltFeed</title>
</svelte:head>

<section>
    <button class="text-white p-2 bg-gray-600 rounded-xl ml-2" on:click={() => {
        invalidate("/api/feed")
    }}>
        Refresh cache
    </button>
</section>


<!--{#if $navigating}-->
<!--    <div class="skelly_container">-->
<!--        <div class="wiget_skelly">-->
<!--            <PostWigetSkeleton/>-->
<!--        </div>-->
<!--        <div class="wiget_skelly">-->
<!--            <PostWigetSkeleton/>-->
<!--        </div>-->
<!--        <div class="wiget_skelly">-->
<!--            <PostWigetSkeleton/>-->
<!--        </div>-->
<!--    </div>-->
<!--{:else}-->
    <div class="content flex flex-wrap justify-center max-w-full">
        {#if data.feed.posts.length < 0}
            no posts here 🤷
        {:else}
            {#each feed.posts as item}
                <div class="m-2" style="flex-basis: min-content;">
                    <PostWidget post={item}/>
                </div>
            {/each}
        {/if}
    </div>
<!--{/if}-->


{#if data.feed.pagesAvalible > 1}
    <div class="flex">
        {#each [...Array(data.feed.pagesAvalible).keys()] as pageIndex}
            <!--{pageIndex}-->
        {/each}
    </div>
{/if}