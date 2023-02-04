<script>
    import CircleSpiner from "$lib/components/util/CircleSpiner.svelte";
    import {sendManageRequest} from "$lib/shared/util/ClientRestClient.js";

    export let postId
    export let status

    let statusFr = (status ? status.name : undefined) || 'Completed'

    let statues = [
        'Completed',
        'Ongoing',
        'Licensed',
        'Dropped',
        'Hiatus',
        'Discontinued'
    ]

    let loading = false;

    async function updateStatus() {
        loading = true

        const res = await sendManageRequest('/post/updateStatus', {
            postId: postId,
            status: statusFr
        })


        if(res.status !== 'ok'){
            alert('Error updating status')
        } else {
            status = {name: res.data.status}
            statusFr = res.data.status
        }

        loading = false
    }


</script>

<div class="grid grid-cols-1 bg-stone-500 max-w-[22rem] m-1 text-white min-h-min bg-stone-500">
    <div class="ml-1 mr-1 mt-1">
        <p class="text-xl float-left">
            Status
        </p>

        <span class="float-left m-1">
            {#if loading}
                <CircleSpiner color="#ffffff" size="1" unit="rem"/>
            {/if}
        </span>

        <select disabled={loading} bind:value={statusFr} on:change={() => {updateStatus()}}
                class="bg-stone-600 p-0.5 mb-0.5 float-right w-1/3">
            {#each statues as status}
                <option value="{status}">{status}</option>
            {/each}
        </select>

    </div>
</div>