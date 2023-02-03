<script>

    import EditableAtribute from '$lib/components/admin/editor/editableAtribute.svelte'
    import {sendManageRequest} from "$lib/shared/util/ClientRestClient.js";

    export let title

    export let postId

    let localTitle = title

    let loading = false

    async function pushTitleChange() {
        loading = true

        const {status} = await sendManageRequest('/post/title', {
            title: localTitle, postId: postId
        })

        if (status === 'ok') {
            title = localTitle
            loading = false
        } else {
            alert('Something went wrong while saving the title')
        }

    }

</script>


<EditableAtribute on:save={pushTitleChange} bind:loading={loading} name="Title" bind:attribute={localTitle}/>