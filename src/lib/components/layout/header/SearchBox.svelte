<script>
    import {goto} from "$app/navigation";

    const cacheMap = new Map();
    let quickSearchResults = []

    let nextRefresh = undefined;


    function quickSearch() {
        if (searchBoxVal.length === 0) {
            quickSearchResults = [];
            return;
        }
        if (searchBoxVal.length < 2) return;
        if (cacheMap.has(searchBoxVal)) {
            quickSearchResults = cacheMap.get(searchBoxVal);
        } else {
            // throttle this so it happens at most, every 500ms
            if (nextRefresh !== undefined) {
                clearTimeout(nextRefresh);
            }

            nextRefresh = setTimeout(() => {
                nextRefresh = undefined;
                fetch(`/api/search/full?query=${searchBoxVal}&limit=5`)
                    .then(response => response.json())
                    .then(json => {
                        const {data} = json
                        cacheMap.set(searchBoxVal, data);
                        quickSearchResults = data;
                    }).catch(err => {
                    alert("Error searching")
                    console.error(err);
                })
            }, 300);

        }
    }


    let isFocused = false;

    const onFocus = () => isFocused = true;
    const onBlur = () => isFocused = false;

    function newSearchInput({link}) {
        searchBoxVal = "";
        quickSearchResults = [];
        goto(link);
    }

    let searchBoxVal = "";

</script>

<div class="flex justify-center w-full h-full">
    <form class="max-[500px]:w-full min-[500px]:w-1/2" autocomplete="off">
        <input bind:value={searchBoxVal}
               on:keydown={quickSearch}
               id="searchfield"
               class="font-light p-2 text-left rounded-none"
               type="text"
               name="searchfield"
               placeholder="Search"
               on:focus={onFocus}
               on:blur={onBlur}
        >
        <div class="relative">
            {#if isFocused === true}
                <ul class="z-1">

                    {#each quickSearchResults as oneResult}
                        <li on:mousedown={() => newSearchInput(oneResult)}>
                            {#if oneResult.type === "post"}
                                <div class="resultcontainer">
                                    {oneResult.contents.title}
                                    <img alt="Poster for post" class="post-poster"
                                         src="/api/asset/proxy/{oneResult.contents.posterAssetId}">
                                </div>
                            {:else}
                                <div class="resultcontainer">
                                    <p>
                                        <a alt="{oneResult.type}" href="{oneResult.link}">{oneResult.contents}</a>
                                        <span class="text-gray-500 font-bold">{oneResult.type}</span>
                                    </p>
                                </div>
                            {/if}
                        </li>
                    {/each}

                </ul>
            {/if}
        </div>
    </form>
</div>

<style>
    input {
        text-align: center;
        outline: none;
        display: block;
        transition: width 0.2s ease-in-out;
        margin: auto;

        position: relative;
        border-radius: 0;
        width: 65%;
        height: 75%;
        box-shadow: inset 0 0 10px #868686;
    }

    .post-poster {
        width: 50px;
        object-fit: contain;
    }

    .resultcontainer {
        max-height: 4em;
        display: grid;
        grid-template-columns: 1fr auto;
    }


    input:focus {
        width: 100%;
    }

    input:hover {
        box-shadow: rgba(0, 0, 0, 0.16) 0 4px 8px, rgba(0, 0, 0, 0.23) 0 4px 8px;
    }

    ul {
        width: 100%;
        top: 100%;
        left: 0;
        position: absolute;
        margin: 0;
    }

    li {
        width: 100%;

        list-style: none;

        padding: 10px;
        cursor: pointer;
        background-color: #fff;
    }

    li:hover {
        background-color: lightgray;
    }

</style>