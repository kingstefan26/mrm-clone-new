<script>
    import ExpandableList from '$lib/components/admin/editor/expandableList.svelte'
    import {sendManageRequest} from "$lib/shared/util/ClientRestClient.js";
    export let tags
    export let postId

    let tagNames = tags.map(s => s.name)


    let loading = false

    async function pushChange(){
        loading = true

        const {status} = await sendManageRequest('/post/tags', {
            postId: postId,
            tags: tagNames
        })

        if(status === 'ok'){
            loading = false
        }

    }

</script>

<ExpandableList on:save={pushChange} bind:loading={loading} name="Tags" bind:options={tagNames} />