<script>
    import ImageEditor from '$lib/components/admin/editor/imageEditor.svelte'
    import ExpandableList from '$lib/components/admin/editor/expandableList.svelte'
    import EditableAtribute from '$lib/components/admin/editor/editableAtribute.svelte'
    import Modal from "$lib/components/popup/Modal.svelte";
    import {modal} from "$lib/components/popup/stores.js";

    export let data;

    let fileinput;
    const onFileSelected = (e) => {
        let image = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e => {
            data.post.poster.path = e.target.result
        };
    }

</script>

<svelte:head>
    <title>
        Editing "{data.post.title}"
    </title>
</svelte:head>

<div class="text-white dark:bg-stone-600">
    <div class="w-full mb-3 mt-2">
        <h1 class="text-center text-2xl">
            EDITING "{data.post.title}"
        </h1>
    </div>
    <div class="flex gap-2">
        <div class="w-max">
            <Modal show={$modal}>
                <div class="flex flex-wrap gap-1 justify-center w-full">
                    <ImageEditor imageLink="{data.post.poster.path}" headerName="Edit Poster"/>
                </div>
            </Modal>
        </div>
        <div>
            <a href="/post/{data.post.title}" class="underline">Preview</a>
            <h1>Edit Metadata:</h1>
            <EditableAtribute name="Title" bind:attribute={data.post.title}/>
            <EditableAtribute name="Author" bind:attribute={data.post.author}/>
            <ExpandableList name="Genres" bind:options={data.post.geners}/>
            <ExpandableList name="Tags" bind:options={data.post.tags}/>
            <ExpandableList name="Categories" bind:options={data.post.categories}/>
            <br>
            <button class="p-2 bg-neutral-600 border-blue-100 border-2">Save</button>
            <br>
            <p class="break-all max-w-xl">
                JSON OUTPUT:
                {#key data.post}
                    {JSON.stringify(data.post)}
                {/key}
            </p>
        </div>
        <div>
            <h1>Edit Chapters:</h1>

            <div class="flex flex-wrap gap-2">
                {#each data.chapters as chapter}
                    <div class="text-center drop-shadow-2xl shadow-2xl bg-neutral-600 text-neutral-100 ">
                        <span>
                            {chapter.chapter.name}
                        </span>
                        <a href="/admin/manage/posts/edit/{data.post.id}/chapter/{data.chapters.indexOf(chapter)}">
                            <img src="/asset/{chapter.chapter.chapter_media[0].path}" height="200" width="150"
                                 class="object-cover w-[150px] h-[200px]" alt="chapter poster">
                        </a>

                    </div>
                {/each}
            </div>
        </div>
    </div>

</div>


