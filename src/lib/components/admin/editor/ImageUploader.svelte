<script>
    let fileInput

    function handleClick() {
        fileInput.click()
    }

    let responce

    let imageLink = ''

    async function handleFilesChosen() {
        const curFiles = fileInput.files;
        // upload the files one by one to POST /api/upload
        for (const item of curFiles) {
            const formData = new FormData();
            formData.append('file', item);
            formData.append('lang', 'en')
            const res = await fetch('/api/asset/upload', {
                method: 'POST',
                body: formData
            });
            const json = await res.json();
            console.log(json);
            responce = json

        }

    }

    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    function setImage(assetId) {
        dispatch('assetUploaded', {assetId})
    }


</script>

<input on:change={handleFilesChosen} style="display: none" type="file" bind:this={fileInput}>
<button on:click={handleClick}>
    <h1>
        Pick files
    </h1>
</button>
{#if responce}
    Responce: { JSON.stringify(responce)}
    Preview:
    <img src="/api/asset/proxy/{responce.assetId}" alt="Preview of uploaded image">
    <button on:click={setImage(responce.assetId)}>
        Set
    </button>
{/if}



