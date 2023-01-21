<script>
    import EditableArtibute from '$lib/components/admin/editor/editableAtribute.svelte'
    import ImageEditor from '$lib/components/admin/editor/imageEditor.svelte'
    import Modal from "$lib/components/popup/Modal.svelte";

    import { modal } from '$lib/components/popup/stores';

    export let data

    let chapter = data.chapter.chapter
</script>

<div class="dark:bg-stone-600">
    <!--{#key data}-->
    <!--    {JSON.stringify(chapter)}-->
    <!--{/key}-->

    <h1 class="text-center text-white text-xl font-bold">
        Editing Chapter
    </h1>

    <EditableArtibute name="Name" bind:attribute={chapter.name} />

    <h1 class="text-center text-white text-xl font-bold">
        Edit Media
    </h1>
    <Modal show={$modal}>
        <div class="flex flex-wrap gap-1 justify-center w-full">
            {#each chapter.chapter_media as media}
                <ImageEditor imageLink="/asset{media.path}" />
            {/each}
        </div>
    </Modal>
</div>