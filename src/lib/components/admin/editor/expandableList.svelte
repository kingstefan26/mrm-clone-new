<script>
    import CircleSpiner from "$lib/components/util/CircleSpiner.svelte";
    import {createEventDispatcher} from 'svelte';

    export let name
    export let options = [
        'prop',
        'prop'
    ]

    export let loading = false

    const dispatch = createEventDispatcher();

    function forward() {
        dispatch('save', {
            options
        });
    }


    let expanded = false
</script>

<div class="grid grid-cols-1 bg-stone-500 max-w-[22rem] m-1 text-white min-h-min bg-stone-500">
    <div class="ml-1 mr-1 mt-1">
        <p class="text-xl float-left">{name}</p>
        <button class="float-right ml-2 m-1" on:click={() => {
                expanded = !expanded;
                if(!expanded) {
                   options = options.filter(a => a !== '')
                }
              }
            }>
            {#if expanded}
                🔼
            {:else}
                🔽
            {/if}
        </button>
        <button disabled='{loading}' class="bg-stone-600 p-0.5 mb-0.5 float-right"
                on:click={forward}>
            Push Changes
        </button>
        <div class="float-right mr-2 min-w-[2rem]">
            {#if loading}
                <CircleSpiner color="#ffffff" size="2" unit="rem"/>
            {/if}
        </div>
    </div>
    {#if expanded}
        {#each options as option}
            <div class="ml-1 mr-1 mb-1">
                <input class="w-5/6 p-1 bg-stone-700" type="text" bind:value={option}>
                <button class="w-1/6 float-right mx-auto text-xl"
                        on:click={()=>{options.splice(options.indexOf(option), 1); options = options}}>🗑️
                </button>
            </div>
        {/each}

        <button on:click={() => {options = [...options, '']}}>
            Add ➕
        </button>
    {/if}
</div>
