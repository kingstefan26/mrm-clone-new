<script>
    import PostWidget from "./PostWiget.svelte";

    import {invalidate} from '$app/navigation';

    import PostWigetSkeleton from "./PostWigetSkeleton.svelte";
    import {navigating} from "$app/stores";

    export let data;

    let feed = data.feed;

</script>

<svelte:head>
    <title>AltFeed</title>
</svelte:head>

<section>
    <button id="refresh" on:click={() => {
        invalidate("/api/feed")
    }}>
        Refresh cache
    </button>
</section>


{#if $navigating}
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
{:else}
    <div class="content">
        {#if data.feed.posts.length < 0}
            no posts here 🤷
        {:else}
            {#each feed.posts as item}
                <div style="flex-basis: min-content; margin: 5px">
                    <PostWidget post={item}/>
                </div>
            {/each}
        {/if}
    </div>
{/if}


{#if data.feed.pagesAvalible > 1}
    <div class="flex">
        {#each [...Array(data.feed.pagesAvalible).keys()] as pageIndex}
            <!--{pageIndex}-->
        {/each}
    </div>
{/if}


<style>

    .flex {
        display: flex;
    }

    .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        overflow: hidden;
        max-width: 100%;
    }

    #refresh {
        color: black;
    }

    .wiget_skelly {
        margin: 6px;
    }

    .skelly_container {
        display: flex;
        justify-content: center;
        align-content: center;
        flex-wrap: wrap;
    }

</style>