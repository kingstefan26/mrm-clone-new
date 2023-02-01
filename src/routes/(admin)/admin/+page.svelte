<script>
    import CircleSpiner from "$lib/components/util/CircleSpiner.svelte";

    async function refreshSearchIndex() {

        loading = true;
        await fetch('/api/manage/search/updateSeachIndex', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: "{}"
        })
        loading = false;
    }

    let loading = false;
</script>

<div class="w-full h-full bg-stone-600">
    <button class="bg-white p-1 font-bold px-3 m-2 border-2 shadow-2xl hover:bg-neutral-600"
        on:click={refreshSearchIndex}
    >
        Recreate Search Index NOW
    </button>
    {#if loading}
        <CircleSpiner color="#ffffff" size="2" unit="rem"/>
    {/if}
    <h1 class="text-center text-9xl text-white">
        Not much here
        m8
    </h1>
</div>