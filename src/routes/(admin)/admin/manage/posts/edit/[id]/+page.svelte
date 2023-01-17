<script>

    import ExpandableList from '$lib/components/admin/editor/expandableList.svelte'
    export let data;

    let  fileinput;
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

<div class="w-full mb-3 mt-2">
    <h1 class="text-center text-2xl">
        EDITING "{data.post.title}"
    </h1>
</div>

<div class="grid grid-cols-3 gap-2">
    <div class="w-max">
        <button class="w-max text-center" on:click={()=>{fileinput.click();}}>
            <input style="display:none" type="file" accept=".jpg, .jpeg, .png, .avif" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
            Edit Poster ✏️
            <img src="{data.post.poster.path}" class=" drop-shadow-2xl shadow-lg border-gray-300 border-2 object-cover w-[180px] h-[260px]" alt="post poster">
        </button>
    </div>
    <div>
        <h1>Edit Metadata:</h1>
        <p>
            Title:
            <input type="text" placeholder="{data.post.title}" bind:value={data.post.title} >
        </p>
        <p>
            Author:
            <input type="text" placeholder="{data.post.author}" bind:value={data.post.author}>
        </p>
        <ExpandableList name="Genres" bind:options={data.post.geners} />
        <ExpandableList name="Tags" bind:options={data.post.tags} />
        <ExpandableList name="Categories" bind:options={data.post.categories} />
        <br>
        <button>Save</button>
        <br>
        <p class="break-all max-w-full ">
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
                <div class="text-center drop-shadow-2xl shadow-2xl border-gray-300 border-2 bg-neutral-600 text-neutral-100 ">
                    <span>
                        {chapter.chapter.name}
                    </span>
                    <img src="/asset/{chapter.chapter.chapter_media[0].path}" height="200" width="150" class="object-cover w-[150px] h-[200px]" alt="chapter poster">
                </div>
            {/each}
        </div>
    </div>

</div>


