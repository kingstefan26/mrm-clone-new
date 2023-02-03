<script>
    import AssetPicker from "$lib/components/admin/editor/AssetPicker.svelte";
    import {sendManageRequest} from "$lib/shared/util/ClientRestClient.js";

    export let posterAssetId;
    export let postId

    async function setNewAsset(event) {
        console.log("CHANGING THE POSTER ASSETS ID TO: ", event.detail)
        posterAssetId = event.detail.newAsset.id

        await sendManageRequest('/post/poster', {posterAssetId, postId: postId})

    }

</script>

<div>
    Edit Poster ✏️
    <AssetPicker assetId={posterAssetId} on:assetpicked={setNewAsset}/>
</div>