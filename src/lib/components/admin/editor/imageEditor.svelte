<script>
    export let headerName = "Edit"
    export let imageLink
    export let newImageLink

    import ImageUploader from "$lib/components/admin/editor/ImageUploader.svelte";

    import { bind } from '$lib/components/popup/Modal.svelte';

    import { modal } from '$lib/components/popup/stores.js';

    const showPopup = () => {
        modal.set(bind(ImageUploader, { img: imageLink }));
    };

</script>

<div>
    <button on:click={showPopup} class="text-white">{headerName} ✏️
        <img src="{imageLink}" alt="" width="160" height="260">
    </button>
</div>
