<script>

    import EditableAtribute from '$lib/components/admin/editor/editableAtribute.svelte'

    export let title

    export let postId

    let localTitle = title

    let loading = false

    async function pushTitleChange(){
        loading = true

        const res = await fetch(`/api/manage/post/title`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: localTitle,
                postId: postId
            })
        })

        const data = await res.json()

        if(data.status === 'ok'){
            title = localTitle
            loading = false
        }

    }

</script>


<EditableAtribute on:save={pushTitleChange} bind:loading={loading} name="Title" bind:attribute={localTitle}/>