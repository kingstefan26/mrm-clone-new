<script>
    export let name
    export let attribute

    export let multiline = false

    export let loading = false

    let lastSavedAttribute = attribute

    import CircleSpiner from "$lib/components/util/CircleSpiner.svelte";

    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();

    function forward() {
        dispatch('save', {
            attribute
        });
        lastSavedAttribute = attribute
    }


</script>

<div class="max-w-[22rem] m-1 text-white min-h-min bg-stone-500">
    <h1 class="mt-2 ml-2 text-lg">{name}:</h1>


    {#if multiline}
        <textarea class:text-gray-200={lastSavedAttribute === attribute}
                  disabled='{loading}'  bind:value={attribute}
                  class:italic={lastSavedAttribute === attribute}
                  class="ml-1 max-h-max p-1 bg-stone-700 text-white border-[1px]" type="text" placeholder="{attribute}"
                  rows="3" cols="20"
        ></textarea>
        {:else}
        <input disabled='{loading}' class:italic={lastSavedAttribute === attribute}
               class:text-gray-200={lastSavedAttribute === attribute}
               class="ml-1 max-h-max p-1 bg-stone-700 text-white border-[1px]" type="text" placeholder="{attribute}"
               bind:value={attribute}>
    {/if}


    <button disabled='{(loading || lastSavedAttribute == attribute)}' class="bg-stone-600 p-0.5 mb-0.5"
            on:click={forward}>
        Push Changes
    </button>
    <div class="float-right mr-2 min-w-[2rem]">
        {#if loading}

            <CircleSpiner color="#ffffff" size="2" unit="rem"/>

        {/if}
    </div>
</div>