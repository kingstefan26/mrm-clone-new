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
</script>


<article class="wrapper">
    <header class="thehead">
        <div class="linkconta">
            <a data-sveltekit-preload-code="hover" href="/post/{post.title}" class="title_link">
                <h2>{post.title}</h2>
            </a>
        </div>
        <p class="about_text">
            {#if post.lang}
                [{post.lang.toUpperCase()}]
            {/if}
            {#if post.author}
                <a class="author_link" href="/tag/{post.author}">[{post.author}]</a>
            {/if}
        </p>
    </header>

    <section>
        <a data-sveltekit-preload-data class="center" href="/post/{post.title}">
            <img alt="Poster for {post.title}" src={post.poster.path} style="object-fit: cover; background: rgb(96, 96, 96)" height="260" width="180">
        </a>
        {#if post.chapter_count > 1}
            <div class="chapter_links_container">
                <!--weird trick to make a 'range' in js-->
                {#each [...Array(post.chapter_count).keys()] as chapter}
                    <a class="chapter_link" href="/post/{post.id}/{chapter}">{chapter}</a>
                {/each}
            </div>
        {/if}
    </section>


</article>


<style>
    * {
        font-weight: 500;
    }
    .chapter_links_container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 100%;
    }

    .about_text {
        margin: auto;
        color: #929292;
        font-family: helvetica neue, Helvetica, Arial, sans-serif;
        font-weight: 300;
    }

    .title_link {
        margin: auto;
        padding-top: 2px
    }

    .title_link:hover > h2 {
        transition: 0.2s;
        color: #6eb9df;
    }

    .chapter_link {
        padding: 0 3px 0 3px;
        color: #4992af;
        font-weight: 400;
    }

    .author_link:hover {
        transition: 0.2s;
        color: #6eb9df;
    }

    .thehead {
        height: 70px;
        display: grid;
        grid-auto-rows: 50% 50%;
    }

    h2 {
        font-family: helvetica neue, Helvetica, Arial, sans-serif;
        font-weight: 500;
        font-size: 1.16em;
        color: #c9c9c9;
    }

    .wrapper {
        text-align: center;

        width: max-content;
        height: max-content;

        max-width: 200px;
        max-height: 400px;

        flex: 1 1 auto;

        /*background-color: rgb(68, 68, 68);*/
        border-radius: 10px;
        /*border: 1px red solid;*/
        border-bottom: 100px;
    }

    header {
        height: 100px;
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