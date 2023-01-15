<script>
    import PostWidget from "./PostWiget.svelte";

    import {cockpitOrgin} from "$lib/shared/host.js";

    import {onMount} from "svelte";
    import PostWigetSkeleton from "./PostWigetSkeleton.svelte";
    import {getFeedPage} from "$lib/api/client/util.js";

    const BASE_URL = cockpitOrgin;
    const BASE_IMAGE_URL = `${BASE_URL}/storage/uploads`;

    /** @type {import('./$types').RequestHandler} */

    let iserrror = false;

    let currentPage = 0

    const fetchcocks = async () => {

        console.log('featching cocks');

        let feed = await getFeedPage(currentPage, fetch);

        await new Promise(r => setTimeout(r, 1000));

        return feed.posts;
    };

    onMount(() => {
        // if running in a browser, cache in session storage
        if (window) {
            const cachedFeed = sessionStorage.getItem("feed");
            if (cachedFeed) {
                const json = JSON.parse(cachedFeed);
                if (!json.length) {
                    iserrror = true;
                    return;
                }
                feed = json;
            } else {
                feed = fetchcocks().then(cocks => {
                    sessionStorage.setItem("feed", JSON.stringify(cocks));
                    return cocks
                })
            }
        } else {
            feed = fetchcocks();
        }
    });

    let feed;

</script>

<style>

    .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        overflow: hidden;
        max-width: 100%;
    }

    .error {
        text-align: center;
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


<svelte:head>
    <title>AltFeed</title>
</svelte:head>

<section>
    <button id="refresh" on:click={() => {sessionStorage.removeItem("feed"); location.reload();}}>
        Refresh cache
    </button>
</section>

{#if feed}
    {#await feed}
        <div class="skelly_container">

            <div class="wiget_skelly">
                <PostWigetSkeleton/>
            </div>
            <div class="wiget_skelly">
                <PostWigetSkeleton/>
            </div>
            <div class="wiget_skelly">
                <PostWigetSkeleton/>
            </div>
        </div>


    {:then feed}
        <div class="content">
            {#each feed as item}
                <div style="flex-basis: min-content; margin: 5px">
                    <PostWidget post={item}/>
                </div>
            {/each}
        </div>
    {:catch err}
        <div class="error">
            <h1>Error</h1>
            <p>Something went wrong.</p>
        </div>
    {/await}
{:else}
    <div class="skelly_container">
        <div class="wiget_skelly">
            <PostWigetSkeleton/>
        </div>
        <div class="wiget_skelly">
            <PostWigetSkeleton/>
        </div>
        <div class="wiget_skelly">
            <PostWigetSkeleton/>
        </div>
    </div>
{/if}




