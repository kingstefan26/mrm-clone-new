<script>

    import ExpandableList from '$lib/components/admin/editor/expandableList.svelte'

    import TitleEdit from "$lib/components/admin/editor/post/TitleEdit.svelte";
    import AuthorEdit from "$lib/components/admin/editor/post/AuthorEdit.svelte";
    import TagsEdit from "$lib/components/admin/editor/post/TagsEdit.svelte";
    import DescriptionEdit from "$lib/components/admin/editor/post/DescriptionEdit.svelte";
    import PosterEdit from "$lib/components/admin/editor/post/PosterEdit.svelte";
    import PublishedEdit from "$lib/components/admin/editor/post/PublishedEdit.svelte";
    import {goto} from "$app/navigation";

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
            <a href="/post/{data.post.id}" class="underline text-2xl">See Preview</a>
            <h1>Edit Metadata:</h1>

            <PublishedEdit post={data.post} postId="{data.post.id}"/>
            <TitleEdit bind:title={data.post.title} postId="{data.post.id}"/>
            <AuthorEdit bind:author={data.post.Author} postId="{data.post.id}"/>
            <DescriptionEdit bind:postId={data.post.id} bind:description={data.post.description}/>
            <TagsEdit bind:tags={data.post.tags} postId="{data.post.id}"/>
            <ExpandableList name="Genres" bind:options={data.post.geners}/>
            <ExpandableList name="Categories" bind:options={data.post.categories}/>
            <!--            <button class="p-2 bg-neutral-600 border-blue-100 border-2">Save</button>-->
            <PosterEdit postId={data.post.id} posterAssetId={post.posterAssetId}/>
        </div>
        <div>
            <h1>Edit Chapters:</h1>

            <div class="flex flex-wrap gap-2">
                {#if data.post.chapters.length > 0}
                    {#each data.post.chapters as chapter, index}
                        <div class="text-center drop-shadow-2xl shadow-2xl bg-neutral-600 text-neutral-100 ">
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
                <div class=" w-[150px] h-[200px] text-center flex items-center drop-shadow-2xl shadow-2xl bg-neutral-600 text-neutral-100 ">
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
                        </div>
                    {/if}

                </div>

            </div>
        </div>
    </div>

</div>


