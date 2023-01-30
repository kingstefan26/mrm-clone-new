<script>
    export let data

    export let NewAuthor = {
        name: ''
    }

</script>



{JSON.stringify(data.authors)}



{#each data.authors as author (author.id)}
    <div class="">
        <input bind:value={author.name} type="text" placeholder="name">
        <button on:click={() => data.updateAuthor(author)}>Update</button>
        <button on:click={() => data.deleteAuthor(author.id)}>Delete</button>
    </div>
{/each}
<div>
    <input bind:value={NewAuthor.name} type="text" placeholder="name">
    <button class="" on:click={() => data.createAuthor(NewAuthor)}>Create</button>
</div>