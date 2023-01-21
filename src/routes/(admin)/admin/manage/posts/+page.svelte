<script>
    import PostWiget from "$lib/components/feed/PostWiget.svelte";

    export let data;
</script>

<h1 class="text-center text-2xl text-white">Edit existing posts</h1>
<hr class="w-3/4 mx-auto mb-2">
<div class="flex flex-wrap justify-center gap-2 dark:bg-stone-600 mb-4">
    {#each data.feed.posts as post}
        <PostWiget showTags={false} link={`/admin/manage/posts/edit/${post.id}`} post={post} />
    {/each}
</div>

<a href="/admin/manage/posts/create" class="text-center text-white text-xl w-full block">
    Create Post ➕
</a>
