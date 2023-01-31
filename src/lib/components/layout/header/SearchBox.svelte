<script>
    import RichResult from "$lib/components/layout/header/RichResult.svelte";

    const prev = new Map();

    function quickSearch(query) {
        if (prev.has(query)) {
            quickSearchResoults = prev.get(query);
            return;
        }
        fetch(`/api/search/full?query=${query}`)
            .then(response => response.json())
            .then(json => {
                const {data} = json
                prev.set(query, data);
                quickSearchResoults = data;
            });
    }

    let quickSearchResoults = []
</script>

<div class="flex justify-center">
    <input
            on:input={e => {
                console.log(e.target.value);
                const query = e.target.value;
                quickSearch(query);
            }}
            class=" font-light p-2 text-left rounded-none max-[500px]:w-full min-[500px]:w-1/2"
            type="text"
            name="query"
            id="search-input"
            placeholder="Search and filter"
    />
    <div class="flex max-w-full absolute flex-col">
        {#each quickSearchResoults as result}
            <div>
                Resoult
                <!--{@html JSON.stringify(result)}-->
            </div>
            <!--        <RichResult result={result}/>-->
        {/each}
    </div>
</div>

<style>
    form {
        font-family: helvetica neue, Helvetica, Arial, sans-serif;
    }

    #search-input {
        cursor: text;
        background-color: #fff;
        border: 1px solid #ddd;
        color: #333;
        font-size: 1.2rem;
    }

    #search-input:focus-visible {
        color: #333;
        outline: 1px solid #333;
    }


    li {
        background: white;
        position: relative;
        top: 100%;
        left: 2px;
        padding: 10px;
    }

    li:not(:last-of-type) {
        border-bottom: 1px solid #e0e0e0;
    }

    li:hover {
        background-color: #e5e5e5;
    }

    .selected {
        background-color: #e5e5e5;
    }

    .selected:hover {
        background-color: #cacaca;
    }

</style>
