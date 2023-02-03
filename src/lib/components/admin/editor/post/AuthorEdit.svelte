<script>
    import Typeahead from "svelte-typeahead";
    import CircleSpiner from "$lib/components/util/CircleSpiner.svelte";
    import {sendManageRequest} from "$lib/shared/util/ClientRestClient.js";

    export let author

    export let postId

    let localAuthor

    if (author) {
        if (author.name) {
            localAuthor = author.name
        }
    }


    let loading = false

    async function pushChange() {
        loading = true

        const {status} = await sendManageRequest('/post/author', {
            author: localAuthor,
            postId: postId
        })

        if (status === 'ok') {
            author.name = localAuthor
            localAuthor = author.name
        }
        loading = false
    }

    async function getAuthors() {
        const res = await fetch(`/api/data/authors`)

        const json = await res.json()
        const {status, data} = json
        if (status === 'ok') {
            console.log(data)
            return data
        }
    }


    const extract = (item) => {
        return item.name
    };

</script>


<div class="max-w-[22rem] m-1 text-white min-h-min bg-stone-500 pl-1 pr-1 pb-1">
    <p class="text-lg text-white">
        Author: {localAuthor}
    </p>
    {#if loading}
        <CircleSpiner color="#000000" size="2" unit="rem"/>
    {/if}
    <div class="text-black m-1">
        {#await getAuthors()}
            <p class="text-white">
                Loading autocomplete...
            </p>
        {:then authors}
            <Typeahead hideLabel
                       data={authors}
                       {extract}
                       let:value
                       let:result
                       limit={5}
                       on:select={({ detail }) => {localAuthor = detail.selected; pushChange()}}>
                <strong>{@html result.string}</strong>

                <svelte:fragment slot="no-results">
                    <p>
                        Could not find author "{value}", <a class="underline text-blue-600"
                                                            href="/admin/manage/authors">Add Them</a>
                    </p>
                </svelte:fragment>
            </Typeahead>
        {/await}
    </div>
</div>
