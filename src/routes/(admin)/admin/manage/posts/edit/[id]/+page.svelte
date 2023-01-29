<script>

    import ExpandableList from '$lib/components/admin/editor/expandableList.svelte'

    import TitleEdit from "$lib/components/admin/editor/post/TitleEdit.svelte";
    import AuthorEdit from "$lib/components/admin/editor/post/AuthorEdit.svelte";
    import TagsEdit from "$lib/components/admin/editor/post/TagsEdit.svelte";
    import DescriptionEdit from "$lib/components/admin/editor/post/DescriptionEdit.svelte";
    import PosterEdit from "$lib/components/admin/editor/post/PosterEdit.svelte";
    import PublishedEdit from "$lib/components/admin/editor/post/PublishedEdit.svelte";
    import {goto} from "$app/navigation";
    import Popup from "$lib/components/popup/Popup.svelte";

    export let data;

    const post = data.post

    let chapterCreatorStep = 0

    async function createNewChapter() {
        const req = await fetch("/api/manage/post/chapter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newChapterName,
                postId: post.id
            })
        })
        if (req.status === 200) {
            const res = await req.json()
            const {chapterIndex} = res.data
            goto(`/admin/manage/posts/edit/${data.post.id}/chapter/${chapterIndex}`)
        }


    }

    let newChapterName = ""
    let importFolderAsChapter = false


    const uploadFormData = (url, formData, onProgress) =>
        new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', e => onProgress(e.loaded / e.total));
            xhr.addEventListener('load', () => resolve({status: xhr.status, body: xhr.responseText}));
            xhr.addEventListener('error', () => reject(new Error('File upload failed')));
            xhr.addEventListener('abort', () => reject(new Error('File upload aborted')));
            xhr.open('POST', url, true);
            xhr.send(formData);
            // wait for the request to finish
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve({status: xhr.status, body: xhr.responseText})
                }
            };
        });

    async function uploadDir(event) {
        const formData = new FormData();

        // add each file to formData with their respective data
        for (const file of event.target.files){
            formData.append(file.name, file)
        }

        formData.append('postId', post.id)

        try {
            const res = await uploadFormData('/api/import/folderChapter', formData, (progress) => {
                uploadFolderProgress = progress
            })
            const {status, body} = res
            if(status !== 200) {
                throw new Error('Something went wrong')
            }
            const json = JSON.parse(body)
            console.log(json)
            await goto(`/admin/manage/posts/edit/${data.post.id}/chapter/${json.data.indexInParentPost}`)
        } catch (e){
            alert('Something went wrong')
        }

    }
    let uploadFolderProgress = -1
    let deletePostExpanded = false;
    let deletePostConfirmation;


</script>

<svelte:head>
    <title>
        Editing "{post.title}"
    </title>
</svelte:head>

<div class="text-white bg-stone-600">
    <div class="w-full mb-3 mt-2">
        <h1 class="text-center text-2xl">
            EDITING "{post.title}"
        </h1>
    </div>
    <div class="grid grid-cols-[auto,auto]">
        <div>
            <a href="/post/{data.post.id}" class="underline text-2xl">View on Reader</a>
            <br>

            <Popup expanded="{deletePostExpanded}">
                <button on:click="{() => deletePostExpanded = !deletePostExpanded}" slot="alwaysVisible" class="bg-stone-700 p-0.5 mb-0.5 hover:text-red-600">
                    Delete Post
                </button>

                <div slot="content">
                    Are you Sure?
                    Type "DELETE" to confirm
                    <input class="text-gray-500" type="text" bind:value="{deletePostConfirmation}"/>
                    <button class="button bg-stone-700 p-0.5 mb-0.5" value="Delete" on:click={async () => {
                        if(deletePostConfirmation === "DELETE") {
                            const req = await fetch('/api/manage/post/delete', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    postId: post.id
                                })
                            })
                            if(req.status === 200) {
                                goto('/admin/manage/posts')
                            }
                        }
                    }} >
                        Confirm
                    </button>
                </div>

            </Popup>

            <PublishedEdit post={data.post} postId="{data.post.id}"/>
            <TitleEdit bind:title={data.post.title} postId="{data.post.id}"/>
            <AuthorEdit bind:author={data.post.Author} postId="{data.post.id}"/>
            <DescriptionEdit bind:postId={data.post.id} bind:description={data.post.description}/>
            <TagsEdit bind:tags={data.post.tags} postId="{data.post.id}"/>
            <ExpandableList name="Genres" bind:options={data.post.geners}/>
            <ExpandableList name="Categories" bind:options={data.post.categories}/>
            <PosterEdit postId={data.post.id} posterAssetId={post.posterAssetId}/>
        </div>
        <div>
            <h1>Edit Chapters:</h1>

            <div class="flex flex-wrap gap-2">
                {#if data.post.chapters.length > 0}
                    {#each data.post.chapters as chapter, index}
                        <div class="text-center drop-shadow-2xl shadow-2xl bg-neutral-600 text-neutral-100">
                            <span>
                                {chapter.name}
                            </span>
                            <a href="/admin/manage/posts/edit/{data.post.id}/chapter/{chapter.indexInParentPost}">
                                {#if chapter.assets.length > 0}
                                    <img src="/api/asset/proxy/{chapter.assets[0].id}" height="200" width="150"
                                         class="object-cover w-[150px] h-[200px]" alt="chapter poster">
                                {:else}
                                    <div class="w-[150px] h-[200px]"></div>
                                {/if}
                            </a>

                        </div>
                    {/each}
                {/if}
                <div class=" w-[150px] h-[224px] text-center flex items-center drop-shadow-2xl shadow-2xl bg-neutral-600 text-neutral-100">
                    {#if chapterCreatorStep === 0}
                        <button on:click={() => {chapterCreatorStep++}}>
                            Create New Chapter ➕
                        </button>
                    {:else}
                        <div class="flex flex-col gap-2 max-w-full">
                            <input bind:value={newChapterName}
                                   class="ml-1 max-h-max p-1 bg-stone-700 text-white border-[1px]" type="text"
                                   placeholder="Chapter Name">
                            <button class="p-2 bg-neutral-600 border-blue-100 border-2" on:click={createNewChapter}>
                                Create
                            </button>
                            <Popup expanded="{importFolderAsChapter}">
                                <button slot="alwaysVisible" on:click={()=>{importFolderAsChapter = true}}>
                                    Or Import a folder as a chapter
                                </button>
                                <div slot="content">
                                    <p>
                                        This will import all files in the folder you select.
                                        The first file will be used as the cover image.
                                        The rest will be used as the post content.
                                        Please note that the files should be numbered in their file names in the order you want them to appear in the post.
                                    </p>
                                    <label class="text-white text-xl font-bold">
                                        Import folder
                                    </label>
                                    <input on:change={uploadDir}
                                           webkitdirectory
                                           class="bg-stone-500 text-white p-0.5"
                                           type="file">
                                    {#if uploadFolderProgress > -1}
                                        <div class="progress-bar">
                                            <div class="progress-bar__fill" style="width: {uploadFolderProgress * 100}%"/>
                                        </div>
                                    {/if}
                                </div>
                            </Popup>
                        </div>
                    {/if}

                </div>

            </div>
        </div>
    </div>

</div>


