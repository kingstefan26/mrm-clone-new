<script>
    import CircleSpiner from "$lib/components/util/CircleSpiner.svelte";
    import {sendManageRequest} from "$lib/shared/util/ClientRestClient.js";

    export let post


    let cheked = post.published

    export let postId

    let loading = false


    async function pushChange(){
        loading = true
        cheked = !cheked
        console.log(cheked)

        const {status} = await sendManageRequest('/post/published', {
            published: cheked,
            postId: postId
        })

        if(status === 'ok'){
            loading = false
        }

    }

</script>

<label>Published: </label>
<input bind:checked={cheked} type="checkbox" name="" on:click={pushChange}>
{#if loading}
    <CircleSpiner color="#ffffff" size="2" unit="rem"/>
{/if}