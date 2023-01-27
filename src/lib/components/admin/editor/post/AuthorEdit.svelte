<script>

    import EditableAtribute from '$lib/components/admin/editor/editableAtribute.svelte'

    export let author

    export let postId

    $: {
        if(author){
            if(author.name){
                localAuthor = author.name
            }
        }
    }

    let localAuthor

    let loading = false

    async function pushChange(){
        loading = true

        const res = await fetch(`/api/manage/post/author`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                author: localAuthor,
                postId: postId
            })
        })

        const data = await res.json()

        if(data.status === 'ok'){
            author = localAuthor
            loading = false
        }

    }

</script>


<EditableAtribute on:save={pushChange} bind:loading={loading} name="Author" bind:attribute={localAuthor}/>