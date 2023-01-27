<script>
    import ExpandableList from '$lib/components/admin/editor/expandableList.svelte'
    export let tags
    export let postId

    let tagNames = tags.map(s => s.name)


    let loading = false

    async function pushChange(){
        loading = true

        const res = await fetch(`/api/manage/post/tags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tags: tagNames,
                postId: postId
            })
        })

        const data = await res.json()

        if(data.status === 'ok'){
            loading = false
        }

    }

</script>

<ExpandableList on:save={pushChange} bind:loading={loading} name="Tags" bind:options={tagNames} />