<script>
    export let post = {
        title: undefined,
        coverpicurl: "",
        id: 0,
        author: undefined,
        lang: undefined,
        link: `/post/${post.title}`,
        chapter_count: 0
    };
    export let link = `/post/${post.title}`
    export let showTags = true
</script>


<article class="wrapper text-center">
    <header class="thehead grid h-20">
        <div>
            <a class="title_link " data-sveltekit-preload-data href="{link}" >
                <h2 class="text-xl font-medium">{post.title}</h2>
            </a>
        </div>
        <p class="about_text m-auto font-light">
            {#if post.lang}
                [{post.lang.toUpperCase()}]
            {/if}
            {#if post.author}
                <a class="author_link no-underline" href="/tag/{post.author}">[{post.author}]</a>
            {/if}
        </p>
    </header>

    <section>
        <a data-sveltekit-preload-data class="center no-underline w-[180px] h-[260px]" href="{link}">
            <img alt="Poster for {post.title}" src={post.poster.path} class="object-cover" style="background: rgb(96, 96, 96)" height="260" width="180">
        </a>
        {#if post.chapter_count > 1 && showTags}
            <div class="chapter_links_container flex flex-wrap justify-center max-w-full">
                <!--weird trick to make a 'range' in js-->
                {#each [...Array(post.chapter_count).keys()] as chapter}
                    <a class="chapter_link pl-0.5 pr-0.5 font-light" href="/post/{post.id}/{chapter}">{chapter}</a>
                {/each}
            </div>
        {/if}
    </section>
</article>


<style>
    .about_text {
        color: #929292;
        font-family: helvetica neue, Helvetica, Arial, sans-serif;
    }


    .title_link:hover > h2 {
        transition: 0.2s;
        color: #6eb9df;
    }

    .chapter_link {
        color: #4992af;
    }

    .author_link:hover {
        transition: 0.2s;
        color: #6eb9df;
    }

    .thehead {
        /*height: 70px;*/
        grid-auto-rows: 50% 50%;
    }

    h2 {
        font-family: helvetica neue, Helvetica, Arial, sans-serif;
        color: #c9c9c9;
    }

    .wrapper {
        width: max-content;
        height: max-content;

        max-width: 180px;
        max-height: 400px;

        flex: 1 1 auto;

        /*background-color: rgb(68, 68, 68);*/
        border-radius: 10px;
        /*border: 1px red solid;*/
        border-bottom: 100px;
    }

    .center {
        max-width: 100%;
        display: flex;
        justify-content: center;
    }
    a {
        text-decoration: none;
    }

</style>