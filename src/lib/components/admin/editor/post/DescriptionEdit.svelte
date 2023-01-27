<script>

    import EditableAtribute from '$lib/components/admin/editor/editableAtribute.svelte'

    export let description

    export let postId

    let localAuthor = description

    let loading = false

    async function pushChange(){
        loading = true

        const res = await fetch(`/api/manage/post/description`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: localAuthor,
                postId: postId
            })
        })

        const data = await res.json()

        if(data.status === 'ok'){
            description = localAuthor
            loading = false
        }

    }

</script>


<EditableAtribute multiline={true} on:save={pushChange} bind:loading={loading} name="Description" bind:attribute={localAuthor}/>