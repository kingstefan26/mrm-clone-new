<script>
    import PageTransision from "$lib/components/util/pageTransision.svelte";
    import {lazyLoad} from '$lib/shared/util/LazyLoad'

    export let doublePageview;
    export let chapter;
    export let post;
    export let current_chapter;

    function formatTime(unixTimeStamp) {
        const a = new Date(unixTimeStamp);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${(a.getDate())} ${months[a.getMonth()]} ${(a.getFullYear())}`;
    }

    const chapterLink = (index) => `/post/${post.id}/${index}`
    let langOverride = '';

</script>

<div class="mx-auto max-w-[1020px]">
    <div class="mr-2 ml-2">
        <!--        <button class="switchvieverstylebtn"-->
        <!--                on:click={() => { $doublePageview = !$doublePageview; }}-->
        <!--        >-->
        <!--            Reader mode-->
        <!--        </button>-->
        <button class="switchvieverstylebtn">
            Reader mode
        </button>


        <h1 class="title font-publicsans">
            {#if !post.Author}
                <a href="/search?artist=annon" class="title_author font-publicsans">
                    [annon]
                </a>
            {:else}
                <a href="/search?artist={post.Author.name}" class="title_author font-publicsans">
                    [{post.Author.name}]
                </a>
            {/if}
            {post.title}
        </h1>

        <time class="creation" datetime="{new Date(post.createdAt)}">
            {formatTime(post.createdAt)}
        </time>

        <div class="tags">
            {#if post.tags.length !== 0}
                Tags:
                {#each post.tags as tag }
                    <a class="tag" href="/search?tag={tag.name}">{tag.name} </a>
                {/each}
            {/if}
        </div>


        {#if post.description}
            <p class="">{post.description}</p>
        {/if}

        <div class="tags">
            {#if post.generes}
                {#if post.generes.length !== 0}
                    Genres:
                    {#each post.generes as tag}
                        <a class="tag" href="/search?genre={tag.name}">{tag.name} </a>
                    {/each}
                {/if}
            {/if}
        </div>

        <div class="tags">
            {#if post.languages}
                {#if post.languages.length > 1}
                    Available in:
                    {#each post.languages as lang }
                        <!-- button that will change langOverride variable to lang -->
                        <button class="tag" on:click={() => { langOverride = `?lang=${lang}`; }}>
                            {lang}
                        </button>
                    {/each}
                {/if}
            {/if}
        </div>


        <div class="tags">
            {#if post.categories}
                {#if post.categories.length !== 0}
                    Categories:
                    {#each post.categories as tag}
                        <a class="tag" href="/search?category={tag.name}">{tag.name} </a>
                    {/each}
                {/if}
            {/if}
        </div>

        {#if post.seriesCount}
            <div class="tags">
                This Post is a part of the series, links to parts:
                {#each post.seriesLinks as link, index}
                    <a href="/post/{link.id}" class="tag">{index + 1}</a>
                {/each}
            </div>
        {/if}

        {#if current_chapter > 0}
            <p class="font-bold mr-2">
                Chapter: #{current_chapter}
            </p>
        {/if}

    </div>

    <hr class="separator bg-[#5b5b5b] mx-auto w-5/6 mb-5">

    <PageTransision pathname={current_chapter}>
        {#each chapter.assets as asset}
            {#if asset.indexInChapter < 2}
                <img class="h-auto w-full"
                     src="/api/asset/proxy/{asset.id}{langOverride}"
                     alt="{asset.indexInChapter}"
                     loading="eager"
                     fetchpriority="high"
                     height="{asset.height}"
                     width="{asset.width}">
            {:else}
                <img use:lazyLoad={`/api/asset/proxy/${asset.id}${langOverride}`}
                     class="pusle_anim h-auto w-full"
                     alt="{asset.indexInChapter}"
                     height="{asset.height}"
                     width="{asset.width}"
                     loading="eager"
                     fetchpriority="high">
            {/if}
        {/each}
    </PageTransision>

    {#if post.chapterCount > 1}
        <div id="linkwrapper">

            {#if current_chapter - 1 >= 0}
                <a href="{chapterLink(current_chapter - 1)}">« Previous</a>
            {/if}

            {#each [...Array(post.chapterCount).keys()] as chapter, index}
                <a href="{chapterLink(index)}"
                   class="{index === current_chapter ? 'iamselected' : ''}">{index}</a>
            {/each}

            {#if current_chapter + 1 < post.chapterCount}
                <a href="{chapterLink(current_chapter + 1)} ">Next »</a>
            {/if}

        </div>
    {/if}
</div>


<style>
    .iamselected {
        color: red;
    }

    .separator {
        color: #5b5b5b;
    }

    .title {
        margin-top: 10px;
        font-weight: 900;
        font-size: 2em;
        color: #c5c4c4;
    }

    .tags {
        color: #a2a2a2;
        margin: 0 0 5px;
    }

    .tag {
        color: #5fb0e1;
        margin-left: 2px;
        margin-right: 2px;
        text-decoration: none;
    }

    .tag:hover {
        text-decoration: underline;
        color: #9dcef1;
        transition: 0.1s;
    }

    .title_author {
        color: #a2a2a2;
        font-family: 'Public Sans', sans-serif;
        font-weight: 800;
    }

    .title_author:hover {
        color: #b6b6b6;
    }

    .creation {
        font-family: 'Public Sans', sans-serif;
        color: #808080;
    }


    #linkwrapper * {
        background-color: #333;
        border-radius: 3px;
        cursor: pointer;
        display: inline-block;
        color: #70bce2;
        padding: 6px;
        font-weight: 400;
        margin: 0 4px;
        font-size: 1.6rem;
    }

    #linkwrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }

    .switchvieverstylebtn {
        color: #ababab;
        border-radius: 0;
        background-color: #2c2c2c;
        border: 0;
        padding: 5px;
        margin: 2px
    }

    .switchvieverstylebtn:hover {
        background-color: #cccccc;
        color: #313131;
        transition: 0.2s;
        cursor: pointer;
    }

    .pusle_anim {
        animation: loading-animation 2s ease-in-out infinite;
        background-color: #343434;
        background-repeat: no-repeat;
        background-image: linear-gradient(90deg, #343434, #505050, #343434);
    }

    @keyframes loading-animation {
        0% {
            background-position: -1000px 0;
        }
        100% {
            background-position: calc(1000px + 100%) 0;
        }
    }
</style>