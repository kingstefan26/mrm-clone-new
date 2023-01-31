<script>
    import Objects from "./Objects.svelte"

    const prev = new Map();
    let quickSearchResoults = []

    function quickSearch(query) {
        if (query.length < 2) return;
        if (prev.has(query)) {
            quickSearchResoults = prev.get(query);
            return;
        }
        fetch(`/api/search/full?query=${query}&limit=5`)
            .then(response => response.json())
            .then(json => {
                const {data} = json
                prev.set(query, data);
                quickSearchResoults = data;
            });
    }


    let searchInput = "";
    let isFocused = false;

    const onFocus = () => isFocused = true;
    // const onBlur = () => isFocused = true;
    const onBlur = () => isFocused = false;

    const newSearchInput = (oneResult) => {
        searchInput = oneResult
    }

</script>

<form class="w-full" autocomplete="off">
    <div class="relative">
        <input on:input={e => quickSearch(e.target.value)}
               id="searchfield"
               class="font-light p-2 text-left rounded-none max-[500px]:w-full min-[500px]:w-1/2"
               type="text"
               name="searchfield"
               placeholder="Search"
               bind:value={searchInput}
               on:focus={onFocus}
               on:blur={onBlur}
        >

    </div>
    <ul class="absolute z-50">
        {#if isFocused === true}
            {#each quickSearchResoults as oneResult}
                <Objects object={oneResult} on:mousedown={() => newSearchInput(oneResult.type)}/>
            {/each}
        {/if}
    </ul>
</form>

<style>
    input {
        position: relative;
        outline: none;
        margin-bottom: 0;
        box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px, rgba(0, 0, 0, 0.23) 0 3px 6px;
        display: block;
        text-align: center;
        border-radius: 0;
        margin-left: auto;
        margin-right: auto;
        transition: width 0.3s ease-in-out;
    }

    input:focus {
        width: 65%;
    }

    input:hover {
        box-shadow: rgba(0, 0, 0, 0.16) 0 4px 8px, rgba(0, 0, 0, 0.23) 0 4px 8px;
    }

    ul {
        padding: 0;
        width: 330px;
        margin-left: auto;
        margin-right: auto;
        max-height: 215px;
    }
</style>