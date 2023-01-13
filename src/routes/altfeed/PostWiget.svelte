<script>
    export let post = {
        title: undefined,
        coverpicurl: undefined,
        id: 0,
        author: undefined,
        lang: undefined,
        link: `/altfeed/post/${post.title}`
    };

</script>


<article class="wrapper">
    <header class="thehead">
        <div class="linkconta">
            <a sveltekit:prefetch href="/altfeed/post/{post.title}" class="thaspelank" style="margin: auto; padding-top: 2px">
                <h2>{post.title}</h2>
            </a>
        </div>
        <p style="margin: auto; color: #b9b9b9; font-family: helvetica neue, Helvetica, Arial, sans-serif;
        font-weight: 300;">
            {#if post.lang}
                [{post.lang.toUpperCase()}]
            {/if }
            {#if post.author}
                <a href="/tag/{post.author}">{post.author}</a>
            {/if }
        </p>


    </header>
    <a sveltekit:prefetch class="center" href="/altfeed/post/{post.title}">

        <!--        <Lazy height="260" offset="300" placeholder="cover">-->
        <img src={post.coverpicurl} style="object-fit: cover" alt="post" height="260" width="180" loading="lazy">
        <!--        </Lazy>-->

    </a>


</article>


<style>

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