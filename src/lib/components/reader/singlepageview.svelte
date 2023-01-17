<script>
    import PageTransision from "$lib/components/util/pageTransision.svelte";
    import {lazyLoad} from '$lib/LazyLoad.js'

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

    const chapterLink = (index) => `/post/${meta.title}/${index}`

</script>

<main class="flex justify-center">
    <article class="content pr-12 pl-12 pb-10 mx-auto">
        {#if !meta}
            <h1>Post not Found</h1>
        {:else}
            <header>
                <section>
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
                </section>

                <section>

                    {#if meta.tags.length !== 0}
                        <p class="tags">
                            Tags:
                            {#each meta.tags as tag }
                                <a class="tag" href="/search?tag={tag}">{tag} </a>
                            {/each}
                        </p>

                    {/if}

                    {#if meta.geners}
                        {#if meta.geners.length !== 0}
                            <p class="tags">
                                Genres:
                                {#each meta.geners as tag }
                                    <a class="tag" href="/search?genre={tag}">{tag} </a>
                                {/each}
                            </p>
                        {/if}
                    {/if}


                    {#if meta.categories.length !== 0}
                        <p class="tags">
                            Categores:
                            {#each meta.categories as tag }
                                <a class="tag" href="/search?category={tag}">{tag}</a>
                            {/each}
                        </p>

                    {/if}

                </section>


                <p class="entry-meta">
                    {#if current_chapter > 0}
                        <p class="tags font-bold mr-2">Chapter: #{current_chapter}</p>
                    {/if}
                </p>

            </header>

            <main class="content_container">
                <hr class="separator mx-auto w-5/6 mb-4">
                <PageTransision pathname={current_chapter}>
                    {#each chapter.chapter_media as image, imgindex}
                        <div class="image-wrapper">
                            {#if imgindex < 2}
                                <img class="content_image" src="{image.path}"
                                     alt="{image.name}" loading="eager" fetchpriority="high" height="{image.height}"
                                     width="{image.width}">
                            {:else}
                                <img use:lazyLoad={image.path}
                                     class="content_image pusle_anim"
                                     alt="{image.name}"
                                     height="{image.height}"
                                     width="{image.width}">
                            {/if}
                        </div>
                    {/each}

                    {#if meta.chapter_count > 1}
                        <div id="linkwrapper">

                            {#if current_chapter - 1 >= 0}
                                <a href="{chapterLink(current_chapter - 1)}">« Previous</a>
                            {/if}

                            {#each [...Array(meta.chapter_count).keys()] as chapter, index}
                                <a href="{chapterLink(index)}"
                                   class="{index === current_chapter ? 'iamselected' : ''}">{index}</a>
                            {/each}

                            {#if current_chapter + 1 < meta.chapter_count}
                                <a href="{chapterLink(current_chapter + 1)} ">Next »</a>
                            {/if}

                        </div>
                    {/if}
                </PageTransision>

            </main>


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

    /*#chaptertitle {*/
    /*    font-family: 'Public Sans', sans-serif;*/
    /*    font-weight: 500;*/
    /*    font-size: 1.2em;*/
    /*}*/

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

    .pusle_anim {
        animation: loading-animation 2s ease-in-out infinite;
        background-color: #343434;
        background-repeat: no-repeat;
        background-image: linear-gradient(
                90deg,
                #343434,
                #505050,
                #343434
        );
    }

    @keyframes loading-animation {
        0% {
            background-position: -1000px 0;
        }
        100% {
            background-position: calc(1000px + 100%) 0;
        }
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