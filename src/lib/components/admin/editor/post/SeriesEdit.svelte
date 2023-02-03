<script>
    import Popup from "$lib/components/popup/Popup.svelte";
    import Typeahead from "svelte-typeahead";
    import {sendManageRequest} from "$lib/shared/util/ClientRestClient.js";

    export let postId
    export let series

    export let indexInSeries


    let expanded = false

    async function getSeries() {
        return await fetch('/api/data/series').then(r => r.json())
    }

    async function createSeries(value) {
        if (series && value === series.name) {
            expanded = false
            return
        }

        await sendManageRequest('/post/createSeries', {
            name: value
        })

        await sendManageRequest('/post/addToSeries', {
            postId: postId,
            seriesName: value
        })

        expanded = false
    }

    async function pickSeries(value) {
        if (series && value === series.name) {
            expanded = false
            return
        }
        await sendManageRequest('/post/addToSeries', {
            postId: postId,
            indexInSeries: indexInSeries,
            seriesName: value
        })
        expanded = false
    }

    function updateIndexInSeries(value) {
        sendManageRequest('/post/updateIndexInSeries', {
            postId: postId,
            indexInSeries: value,
            seriesName: series.name
        })
        expanded = false
    }

    function removeFromSeries() {
        sendManageRequest('/post/removeFromSeries', {
            postId: postId,
            seriesName: series.name
        })
        expanded = false
    }

</script>

<div class="max-w-[22rem] m-1 text-white min-h-min bg-stone-500 pl-1">
    {#if !series}
        This post is not part of any series.
    {:else}
        Part of "{series.name}" Series
    {/if}

    <Popup bind:expanded={expanded}>
        <button class="underline"
                slot="alwaysVisible"
                on:click={()=> {expanded = !expanded}}>
            {#if !series}
                Add to Series
            {:else}
                Change Series
            {/if}

        </button>

        <svelte:fragment slot="content">
            <div class="flex flex-row text-black">
                <div class="flex flex-col">
                    {#await getSeries()}
                        <div class="flex flex-row">
                            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-stone-500"></div>
                        </div>
                    {:then data}
                        <Typeahead hideLabel
                                   data={data.data}
                                   let:value
                                   let:result
                                   limit={5}
                                   on:select={({ detail }) => {pickSeries(detail.selected)}}>
                            <strong>{@html result.string}</strong>

                            <svelte:fragment slot="no-results">
                                <p>
                                    Could not find series "{value}",
                                    <button class="underline"
                                            on:click={createSeries(value)}>
                                        create a new one?
                                    </button>
                                </p>
                            </svelte:fragment>
                        </Typeahead>
                    {/await}
                </div>
                <div class="flex flex-col p-1">
                    {#if series}
                        <label class="text-white">Index in Series</label>
                        <input bind:value={indexInSeries} type="number" min="0"
                               on:input={(ev) => {updateIndexInSeries(ev.data)}}>

                        <button class="text-red-800 bg-white m-1 p-1" on:click={removeFromSeries}>
                            Remove from Series
                        </button>

                    {/if}
                </div>
            </div>
        </svelte:fragment>
    </Popup>

</div>