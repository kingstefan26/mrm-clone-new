<script>

    import EditableAtribute from '$lib/components/admin/editor/editableAtribute.svelte'
    import {sendManageRequest} from "$lib/shared/util/ClientRestClient.js";

    export let description

    export let postId

    let localAuthor = description

    let loading = false

    async function pushChange() {
        loading = true

        const {status} = await sendManageRequest('/post/description', {
            description: localAuthor,
            postId: postId
        })


        if (status === 'ok') {
            description = localAuthor
            loading = false
        }

    }

</script>


<EditableAtribute multiline={true} on:save={pushChange} bind:loading={loading} name="Description"
                  bind:attribute={localAuthor}/>