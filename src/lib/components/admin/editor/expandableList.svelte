<script>
    export let name
    export let options = [
        'prop',
        'prop'
    ]

    let expanded = false
</script>

<div class="grid grid-cols-1 w-full bg-gray-400 border-4">
    <div>
        <span>{name}</span>
        <button on:click={() => {
                expanded = !expanded;
                if(!expanded) {
                   options = options.filter(a => a !== '')
                }}
            }>
            {#if expanded}
                ⬆
            {:else}
                🔻
            {/if}
        </button>
    </div>
    {#if expanded}
        {#key options}
            {#each options as option}
                <span>
                    <input type="text" bind:value={option} autofocus>
                    <button on:click={()=>{options.splice(options.indexOf(option), 1); options = options}}>🗑️</button>
                </span>
            {/each}
        {/key}

        <button on:click={() => {options = [...options, '']}}>
            Add ➕
        </button>
    {/if}
</div>
