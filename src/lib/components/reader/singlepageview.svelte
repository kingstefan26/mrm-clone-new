<script>

    import PageTransision from "$lib/components/PageTransision.svelte";
    import { lazyLoad } from '$lib/LazyLoad.js'

    export let doublePageview;

    export let chapter;
    export let meta;
    export let current_chapter;


    function formatTime(unixTimeStamp) {
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        const a = new Date(unixTimeStamp * 1000);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${(a.getDate())} ${months[a.getMonth()]} ${(a.getFullYear())}`;
    }

    const chapterLink = (index) => `/altfeed/post/${meta.title}/${index}`

</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;600;700;900&display=swap"
          rel="stylesheet">
</svelte:head>

<main class="singlepage-wrapper">
    <article class="content singlepage-content">
        {#if !meta}
            <h1>Post not Found</h1>
        {:else}
            <header>
                <button class="switchvieverstylebtn" on:click={() => { $doublePageview = !$doublePageview; }}>
                    Reader mode
                </button>
                <h2 class="title">
                    <a class="title_author" href="/search?artist={meta.author}">[{meta.author}]</a>
                    {meta.title}
                </h2>

                <p class="entry-meta">
                    <time id="creation"
                          datetime="{new Date(meta.created)}">{formatTime(meta.created)}</time>
                </p>

                <p class="entry-meta">
                    {#if current_chapter > 0}
                        <h3 id="chaptertitle">Chapter: {current_chapter}</h3>
                    {/if}
                </p>

                <section>

                    {#if meta.tags.length !== 0}
                        <p class="tags">
                            Tags:
                            {#each meta.tags as tag }
                                <a class="tag" href="/search?tag={tag}">{tag} </a>
                            {/each}
                        </p>

                    {/if}

                    <!--{#if post.geners}-->
                    <!--    {#if post.geners.length !== 0}-->
                    <!--        <p class="tags">-->
                    <!--            Genres:-->
                    <!--            {#each post.post.geners as tag }-->
                    <!--                <a class="tag" href="/search?genre={tag}">{tag} </a>-->
                    <!--            {/each}-->
                    <!--        </p>-->

                    <!--    {/if}-->
                    <!--{/if}-->


                    {#if meta.categories.length !== 0}
                        <p class="tags">
                            Categores:
                            {#each meta.categories as tag }
                                <a class="tag" href="/search?category={tag}">{tag}</a>
                            {/each}
                        </p>

                    {/if}

                </section>


            </header>

            <hr class="separator">

            <PageTransision pathname={current_chapter}>
                <section class="content_container">
                    {#each chapter.chapter_media as image, imgindex}
                        <div class="image-wrapper">
                            {#if imgindex < 2}
                                <img class="content_image" src="{image.path}"
                                     alt="{image.name}" loading="eager" height="{image.height}"
                                     width="{image.width}">
                            {:else}
                                <img use:lazyLoad={image.path}
                                     class="content_image"
                                     alt="{image.name}"
                                     height="{image.height}"
                                     width="{image.width}">
                            {/if}
                        </div>
                    {/each}

                    {#if meta.chapter_count > 1}
                        <div id="linkwrapper">

                            {#if current_chapter - 1 >= 0}
                                <a href="{chapterLink(current_chapter - 1)}" >« Previous</a>
                            {/if}

                            {#each [...Array(meta.chapter_count).keys()] as chapter, index}
                                <a href="{chapterLink(index)}" class="{index === current_chapter ? 'iamselected' : ''}">{index}</a>
                            {/each}

                            {#if current_chapter + 1 < meta.chapter_count}
                                <a href="{chapterLink(current_chapter + 1)} ">Next »</a>
                            {/if}

                        </div>
                    {/if}

                </section>
            </PageTransision>



        {/if}
    </article>
</main>

<style>
    .iamselected {
        color: red;
    }

    header {
        margin-bottom: 1.5em;
    }

    .separator {
        color: #5b5b5b;

        margin-bottom: 1.5em;
        width: 70%;
    }

    .title {
        margin-top: 10px;
        font-weight: 900;
        font-size: 2em;
        font-family: 'Public Sans', sans-serif;
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

    #creation {
        font-family: 'Public Sans', sans-serif;
        color: #808080;
    }

    #chaptertitle {
        font-family: 'Public Sans', sans-serif;
        font-weight: 500;
        font-size: 1.2em;
    }

    .content_image {
        margin-left: auto;
        margin-right: auto;
        display: block;
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

    .image-wrapper {
        margin-bottom: 2px;
    }

    img {
        max-width: 100%;
        height: fit-content;
        object-fit: scale-down;
    }

    .content {
        /*padding-top: 20px;*/
        padding-right: 10px;
        padding-left: 10px;
        padding-bottom: 10px;
    }


    .singlepage-wrapper {
        display: flex;
        justify-content: center;
    }

    .singlepage-content {
        /*padding-top: 10px;*/
        padding-right: 30px;
        padding-left: 30px;
        padding-bottom: 14px;
        margin-right: auto;
        margin-left: auto;
    }

    .center {
        max-width: 100%;
        display: flex;
        justify-content: center;
    }


    @media screen and (max-width: 500px) {
        .content {
            width: 100%;
            padding: 10px 0 0 0;
            margin: 0;
        }

        header {
            text-align: center;
        }

    }
</style>