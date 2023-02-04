<script>
    import Popup from "$lib/components/popup/Popup.svelte";
    import CircleSpiner from "$lib/components/util/CircleSpiner.svelte";
    import Typeahead from "svelte-typeahead";
    import {sendManageRequest} from "$lib/shared/util/ClientRestClient.js";


    export let postId

    export let genres

    // I FUCKING HATE JS AND THEIR SHITTY REFERENCE SYSTEM
    let lastSavedGeners = JSON.parse(JSON.stringify(genres))

    let expanded = false

    let loading = false

    async function pushChanges() {
        loading = true

        const {status, data} = await sendManageRequest('/post/updateGeneres', {
            genres: genres.map(genre => genre.name),
            postId: postId
        })

        if (status !== 'ok') {
            alert(`Failed to update generes`)
        } else {
            console.log(`got updated generes`, data.generes)
            genres = data.generes
            lastSavedGeners = JSON.parse(JSON.stringify(genres))
        }

        loading = false
    }

    async function getAllGeneres() {
        const {status, data} = await fetch(`/api/data/generes`).then(r => r.json())

        if (status === 'ok') {
            console.log('all avalible generes', data.filter(a => a))
            return data.filter(a => a)
        }
    }

    function addGenere(selected = '') {
        if (selected === '') return
        if (genres.find(genre => genre.name === selected)) return
        genres.push({name: selected})
        genres = genres
    }

    function removeGenere(selected = '') {
        if (selected === '') return
        genres.splice(genres.indexOf(selected), 1)
        genres = genres
    }

    let isUpToDate

    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; ++i) {
            if (a[i].name !== b[i].name) return false;
        }
        return true;
    }

    $: {
        // i want to die
        isUpToDate = arraysEqual(genres, lastSavedGeners)
    }

</script>


<div class="grid grid-cols-1 bg-stone-500 max-w-[22rem] m-1 text-white min-h-min bg-stone-500">
    <div class="ml-1 mr-1 mt-1">
        <p class="text-xl float-left">Genres</p>
        <button class="bg-stone-600 p-0.5 mb-0.5 float-right" on:click={function (){
        expanded = true
    }}>
            Edit
        </button>
    </div>
</div>

<Popup bind:expanded={expanded}>
    <svelte:fragment slot="content">
        <div class="text-xl mt-1 grid grid-cols-2 mb-2">
            <span class="text-2xl">
                Edit Genres
            </span>

            <span>
                {#if loading}
                    <CircleSpiner color="#ffffff" size="1" unit="rem"/>
                {/if}
                <button disabled="{isUpToDate}" class="bg-stone-700 px-3 mb-0.5 float-right disabled:opacity-50 ml-2"
                        on:click={pushChanges}>
                    Push Changes
                </button>
                <span class="italic font-extralight text-stone-300" class:italic={isUpToDate}>
                    {#key isUpToDate}
                        {#if isUpToDate}
                            All changes saved
                        {:else}
                            Changes not saved
                        {/if}
                    {/key}
                </span>
            </span>

        </div>

        <div class="text-black">
            {#await getAllGeneres()}
                <p class="text-white">
                    Loading autocomplete...
                </p>
            {:then genresAll}
                <Typeahead hideLabel
                           data={genresAll}
                           let:value
                           let:result
                           limit={5}
                           on:select={({ detail }) => {addGenere(detail.selected)}}>
                    <strong>{@html result.string}</strong>

                    <svelte:fragment slot="no-results">
                        <p>
                            Could not find genre "{value}",
                            <button on:click={()=>{addGenere(value)}} class="underline text-blue-600">Create it</button>
                        </p>
                    </svelte:fragment>
                </Typeahead>
            {/await}
        </div>

        <div class="grid grid-cols-1 text-white min-h-min bg-stone-500 gap-1 m-1 overflow-scroll max-h-[350px]">
            {#key genres}
                {#each genres as genre}
                    <p class="p-1 bg-stone-700">
                        {genre.name}
                        <button class="w-1/6 float-right text-xl"
                                on:click={()=>{removeGenere(genre.name)}}>🗑️
                        </button>
                    </p>
                {/each}
            {/key}
        </div>

    </svelte:fragment>
</Popup>