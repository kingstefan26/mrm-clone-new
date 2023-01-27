<script>
    import CircleSpiner from "$lib/components/util/CircleSpiner.svelte";

    export let post


    let cheked = post.published

    export let postId

    let loading = false


    async function pushChange(){
        loading = true
        cheked = !cheked
        console.log(cheked)
        const res = await fetch(`/api/manage/post/published`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                published: cheked,
                postId: postId
            })
        })

        const data = await res.json()

        if(data.status === 'ok'){
            loading = false
        }

    }

</script>

<label>Published: </label>
<input bind:checked={cheked} type="checkbox" name="" on:click={pushChange}>
{#if loading}
    <CircleSpiner color="#ffffff" size="2" unit="rem"/>
{/if}