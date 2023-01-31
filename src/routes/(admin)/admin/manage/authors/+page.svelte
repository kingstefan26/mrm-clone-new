<script>
    import CircleSpiner from "$lib/components/util/CircleSpiner.svelte";
    import Typeahead from "svelte-typeahead";

    export let data

    export let currentAuthor

    async function getAuthors() {
        const res = await fetch(`/api/data/authors?limit=50`)

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

    async function showAuthor(selected) {
        console.log(selected)

        const res = await fetch(`/api/data/author?name=${selected}`)

        currentAuthor = await res.json()
    }

    async function createAuthor(value) {
        console.log(value)
        const res = await fetch(`/api/manage/post/createAuthor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: value
            })
        })

        const {status, data} = await res.json()

        if (status === 'ok') {
            console.log(data)

        }

    }
    let loading = false

    async function pushChanges() {
        loading = true
        console.log(currentAuthor)
        const res = await fetch(`/api/manage/post/updateAuthor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: currentAuthor.data.name,
                longName: currentAuthor.data.longName,
                id: currentAuthor.data.id
            })
        })

        const {status, data} = await res.json()
        if(status !== 'ok') {
            alert('Something went wrong')
        } else {
            alert('Changes saved')
            currentAuthor.data = data
        }

        loading = false
    }

</script>
<div class="text-black m-1">
    {#await getAuthors()}
        <p class="text-white">
            <CircleSpiner color="#ffffff" size="2" unit="rem"/>
        </p>
    {:then authors}
        <Typeahead hideLabel
                   data={authors}
                   {extract}
                   let:value
                   let:result
                   limit={5}
                   on:select={({ detail }) => {showAuthor(detail.selected)}}>
            <strong>
                {@html result.string}
            </strong>

            <svelte:fragment slot="no-results">
                <p>
                    Could not find author "{value}", <buttons on:click={createAuthor(value)} class="underline text-blue-600">Add Them</buttons>
                </p>
            </svelte:fragment>
        </Typeahead>
    {/await}
</div>


{#if currentAuthor}
    {JSON.stringify(currentAuthor)}
    <!-- A form showing the author and allows to edit their data-->
    <div class="text-black m-1">
        <h2 class="text-2xl font-bold">Author</h2>
        <div class="grid grid-cols-1 gap-2">
            <div class="flex flex-col">
                <label class="text-lg font-bold">Name</label>
                <input type="text" class="border border-gray-400 p-2 rounded" bind:value={currentAuthor.data.name}>
            </div>
            <div class="flex flex-col">
                <label class="text-lg font-bold">Long Name</label>
                <input type="text" class="border border-gray-400 p-2 rounded" bind:value={currentAuthor.data.longName}>
            </div>
        </div>
        <!--A button allowing to push changes-->
        <button on:click={pushChanges} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
        {#if loading}
            <CircleSpiner color="#ffffff" size="2" unit="rem"/>
        {/if}
    </div>
{/if}