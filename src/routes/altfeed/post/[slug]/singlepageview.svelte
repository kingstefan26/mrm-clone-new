<script>
    import Spiner from '$lib/spiner.svelte'

    export let fetchchapter;
    export let getImage;
    export let data;
    export let doublePageview;

    let currentChapter = 0;

    function formatTime(unixTimeStamp) {
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        const a = new Date(unixTimeStamp * 1000);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${(a.getDate())} ${months[a.getMonth()]} ${(a.getFullYear())}`;
    }

</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;600;700;900&display=swap"
          rel="stylesheet">
</svelte:head>

<main class="singlepage-wrapper">
    <article class="content singlepage-content">
        {#if !data.post.post}
            <h1>Post not Fount</h1>
        {:else}
            <header>
                <button class="switchvieverstylebtn" on:click={() => { $doublePageview = !$doublePageview; }}>
                    Reader mode
                </button>
                <h2 class="title">
                    <a class="title_author" href="/search?artist={data.post.post.author}">[{data.post.post.author}]</a>
                    {data.post.post.title}
                </h2>

                <p class="entry-meta">
                    <time id="creation"
                          datetime="{new Date(data.post.post.created)}">{formatTime(data.post.post.created)}</time>
                </p>

                <p class="entry-meta">
                    {#if currentChapter > 0}
                        <h3 id="chaptertitle">Chapter: {currentChapter}</h3>
                    {/if}
                </p>

                <section>

                    {#if data.post.post.tags.length != 0}
                        <p class="tags">
                            Tags:
                            {#each data.post.post.tags as tag }
                                <a class="tag" href="/search?tag={tag}">{tag} </a>
                            {/each}
                        </p>

                    {/if}

                    {#if data.post.post.geners.length != 0}
                        <p class="tags">
                            Genres:
                            {#each data.post.post.geners as tag }
                                <a class="tag" href="/search?genre={tag}">{tag} </a>
                            {/each}
                        </p>

                    {/if}

                    {#if data.post.post.categories.length != 0}
                        <p class="tags">
                            Categores:
                            {#each data.post.post.categories as tag }
                                <a class="tag" href="/search?category={tag}">{tag}</a>
                            {/each}
                        </p>

                    {/if}

                </section>


            </header>

            <hr class="separator">

            <section class="content_container">
                {#await fetchchapter}
                    <div class="center">
                        <Spiner></Spiner>
                    </div>
                {:then chapters}
                    {#each chapters as chapter, index}
                        {#if currentChapter === index}
                            {#each chapter as image, imgindex}
                                <div class="image-wrapper">

                                    {#await getImage(image.url)}
                                        <div class="center">
                                            <Spiner></Spiner>
                                        </div>
                                    {:then imageurl}
                                        {#if imgindex === 0}
                                            <img class="content_image" src="{imageurl}"
                                                 alt="{image.name}" loading="eager" height="{image.height}"
                                                 width="{image.width}">
                                        {:else}
                                            <img class="content_image" src="{imageurl}"
                                                 alt="{image.name}" loading="lazy" height="{image.height}"
                                                 width="{image.width}">
                                        {/if}

                                    {:catch _}
                                        <p>error</p>
                                    {/await}

                                </div>
                            {/each}
                        {/if}
                    {/each}

                    {#if chapters.length > 1}
                        <div id="linkwrapper">

                            {#if currentChapter - 1 >= 0}
                                <a href="#{currentChapter - 1}" on:click={() => {currentChapter--;}}>« Previous</a>
                            {/if}

                            {#each chapters as chapter, index}
                                <a href=" " class="{index === currentChapter ? 'iamselected' : ''}"
                                   on:click={() => {currentChapter = index;}}>{index}</a>
                            {/each}

                            {#if currentChapter + 1 < chapters.length}
                                <a href="#{currentChapter + 1}" on:click={() => {currentChapter++;}}>Next »</a>
                            {/if}

                        </div>
                    {/if}

                {:catch error}
                    <p>An error occurred!</p>
                {/await}
            </section>


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