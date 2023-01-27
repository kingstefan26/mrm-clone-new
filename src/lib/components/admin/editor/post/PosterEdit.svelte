<script>
    import AssetPicker from "$lib/components/admin/editor/AssetPicker.svelte";

    export let posterAssetId;
    export let postId

    async function setNewAsset(event) {
        console.log("CHANGING THE POSTER ASSETS ID TO: " + event.detail.asset.id)
        posterAssetId = event.detail.asset.id

        await fetch(`/api/manage/post/poster`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                posterAssetId,
                postId: postId
            })
        })

    }

</script>

<div>
    Edit Poster ✏️
    <AssetPicker assetId={posterAssetId} on:assetpicked={setNewAsset} />
</div>