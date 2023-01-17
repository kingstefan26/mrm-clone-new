<script>
    import {goto} from "$app/navigation";
    import ArrowControl from "$lib/components/reader/arrowkeys.svelte";
    import {onMount} from "svelte";

    import logo from "$lib/img/logo-128.png";

    export let doublePageview;
    export let chapter;
    export let meta;
    export let current_chapter;

    const preloadImage = (url) => {
        const image = new Image()
        image.rel = 'reload'
        image.as = 'image'
        image.src = url
        console.log(`preloading ${url}`)
    }

    const getpreviosimage = () => {
        // if we are not at the start
        if (currentimage > 0) {
            return currentimage - 1;

        } else { // if we are at the start
            // check if current chapter is 0
            // if so return current image
            if (current_chapter > 0) {

                // if we go back a chapter is it null
                if (current_chapter - 1 >= 0) {
                    // if the previuos chapter is the start or something after that
                    // go back a chapter
                    current_chapter -= 1;
                    // and return the end of the previos (now current) chapter
                    return chapter.chapter_media.length - 1;
                }
            } else {
                return currentimage;
            }

        }
    };

    const getnextimage = () => {
        // if current image + 1 exisist switch to it
        const nextImageIndex = currentimage + 1;
        if (nextImageIndex < chapter.chapter_media.length) { // does next image exists

            // if the image after that exists preload it
            const imageAfterThat = chapter.chapter_media[currentimage + 2]
            if (imageAfterThat) {

                preloadImage(imageAfterThat.path)
            }

            // return the image index to be displayed
            return nextImageIndex;
        } else if (current_chapter + 1 < meta.chapter_count) { // next image does not exist, check for next chapter

            // reset image state to beginning
            currentimage = 0;

            // navigate to next chapter
            current_chapter += 1;

            return currentimage;
        }

        return currentimage
    };

    const chapterLink = (index) => `/post/${meta.title}/${index}`

    $: (
        goto(chapterLink(current_chapter))
    )


    let currentimage = 0;

    let fullscreencontainer;
    let isFullScreen = false;

    function togglefullscreen() {

        const fullscreenSupport = document.fullscreenEnabled;

        if (!fullscreenSupport) return;

        if (!isFullScreen) {
            const requestFS = (
                fullscreencontainer.requestFullscreen
            ).bind(fullscreencontainer);

            requestFS();
        } else {
            const exitFullscreen = (
                document.exitFullscreen
            ).bind(document);
            exitFullscreen(fullscreencontainer);
        }

        isFullScreen = !isFullScreen;

    }

    onMount(() => {
        const bookmarks = localStorage.getItem("bookmarks");
        if (bookmarks) {
            let bookmarkobj = JSON.parse(bookmarks);

            const thisstorybooksmarks = bookmarkobj.filter(bookmark => bookmark.id === meta.id);


            let largestchapter = 0;
            let largestimage = 0;

            thisstorybooksmarks.forEach(bookmark => {
                if (bookmark.chapter > largestchapter) {
                    largestchapter = bookmark.chapter;
                }
                if (bookmark.image > largestimage) {
                    largestimage = bookmark.image;
                }

            });

            current_chapter = largestchapter;
            currentimage = largestimage;
        }
    });

    let savebookmark = () => {
        let bookmark = {
            chapter: current_chapter,
            image: currentimage,
            id: meta.id,
            title: meta.title,
            poster: meta.poster_path
        };
        const bookmarksks = JSON.parse(localStorage.getItem("bookmarks"));
        console.log(bookmarksks);
        if (bookmarksks) {
            localStorage.setItem("bookmarks", JSON.stringify([...bookmarksks, bookmark]));
        } else {
            localStorage.setItem("bookmarks", JSON.stringify([bookmark]));
        }
    };

    function handlethaclick(e) {
        let clicked = window.innerWidth / 2 < e.clientX;
        // true = right , false = left
        if (clicked) {
            currentimage = getnextimage();
        } else {
            currentimage = getpreviosimage();
        }
    }

    function absorbEvent_(event) {
        const e = event || window.event;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }

    $: current_chapter, currentimage = 0;


</script>


<div id="container" bind:this={fullscreencontainer}>

    <div class="nav-wrapper">
        <div class="nav">
            <button class="backbtn" on:click={() => {goto('/altfeed')}}>« browse</button>

            <button class="extraoptionbtn"
                    on:click={() => { $doublePageview = !$doublePageview }}>
                Exit Reader Mode
            </button>

            <button class="extraoptionbtn" on:click={togglefullscreen}>
                {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>

            <button class="bookmark" on:click={savebookmark} aria-label="bookmark-post">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M16 2v17.582l-4-3.512-4 3.512v-17.582h8zm2-2h-12v24l6-5.269 6 5.269v-24z"/>
                </svg>
            </button>


            <a href="/" class="logo">
                <img width="48" height="48" src="{logo}" alt="logo">
            </a>
        </div>
    </div>

    <div class="content">

        {#if chapter}

            <div class="head-wrapper">
                <div class="head">
                    <h2>{meta.title}</h2>

                    <select class="chapter-picker" bind:value={current_chapter} id="chapter">

                        {#each [...Array(meta.chapter_count).keys()] as i}
                            <option value="{i}">ch.{i}</option>
                        {/each}
                    </select>

                    <select class="image-picker" bind:value={currentimage} id="image">
                        {#each chapter.chapter_media as _, index}
                            <option value="{index}">{index}</option>
                        {/each}
                    </select>
                </div>


            </div>

            <div class="body" on:ontouchstart={absorbEvent_} on:ontouchmove={absorbEvent_} on:ontouchend={absorbEvent_}
                 on:ontouchcancel={absorbEvent_} on:mousedown={absorbEvent_} on:contextmenu={absorbEvent_}
                 on:click|preventDefault={(e) => handlethaclick(e)}>

                <!--          <button id="back-touch" on:click={() => { currentimage = getpreviosimage(chapters); }}></button>-->

                <img src="{chapter.chapter_media[currentimage].path}" alt="{currentimage}">


                <!--          <button id="forward-touch" on:click={() => { currentimage = getnextimage(chapters) }}></button>-->


            </div>

            <div class="controls">

                <button class="arrows arrow-back"
                        on:click={() => { currentimage = getpreviosimage(); }} aria-label="next image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                                d="M0 12c0 6.627 5.373 12 12 12s12-5.373 12-12-5.373-12-12-12-12 5.373-12 12zm7.58 0l5.988-5.995 1.414 1.416-4.574 4.579 4.574 4.59-1.414 1.416-5.988-6.006z"/>
                    </svg>
                </button>


                <button class="arrows arrow-forward"
                        on:click={() => { currentimage = getnextimage()}} aria-label="previos-image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                                d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.568 18.005l-1.414-1.415 4.574-4.59-4.574-4.579 1.414-1.416 5.988 5.995-5.988 6.005z"/>
                    </svg>
                </button>

                <ArrowControl on:right={() => { currentimage = getnextimage() }}
                              on:left={() => { currentimage = getpreviosimage() }}/>

            </div>

        {/if}

    </div>

</div>

<style>
    /*accual layout*/

    :root {
        background: #343434;
    }

    #container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100%;
        background: #343434;
        color: black;
    }


    @media screen and (max-width: 1000px) {
        #container {
            width: 100vw;
        }
    }


    .logo {
        width: 70%;
        text-align: end;
    }

    .bookmark {
        /*border: none;*/
        display: block;
        border: none;
        background: none;
        fill: #d2d2d2;
    }

    .nav-wrapper {
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
        padding: 2px;
    }

    .nav {
        display: flex;
        width: 100%;
        max-width: 800px;
    }

    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }


    .head-wrapper {
        box-shadow: 0 1px 5px 0 #141414;
        margin-bottom: 10px;
        height: min-content;
        padding: 10px;
        display: flex;
        justify-content: center;
    }


    .head {
        box-sizing: unset;
        display: grid;
        height: auto;
        grid-template-columns: 1fr 40px 40px;
    }


    .body {
        padding: 10px;
        display: flex;
        justify-content: center;
        height: 100%;
    }

    .body img {
        max-height: calc(100vh - 200px);
        max-width: 100%;
        object-fit: scale-down;
    }

    .body * {
        object-fit: scale-down;
    }


    .arrows {
        margin: 0 10px 0 10px;
        /*padding: 3px;*/
        text-align: center;
        width: 50%;
        height: min-content;

        background: #343434;
        border: none;
        /*background: #2b2b2b;*/
        /*border-radius: 3px;*/
        /*border: 1px solid black;*/
    }

    .arrows svg {
        width: 24px;
        height: 24px;
        fill: #797979;
    }

    .controls {
        box-shadow: 0 1px 5px 0 #141414;
        padding: 10px;
        height: 30px;
        z-index: 1;
        top: calc(100vh - 50px);
        position: absolute;
        width: 30vw;
        left: calc(50% - 17.5vw);
        background: #343434;
        display: flex;
        justify-content: center;
    }


    /*eww*/
    .chapter-picker {
        background: #2b2b2b;
        display: block;
        border-radius: 3px;
        border: 1px solid black;
        padding: 4px;
    }

    .image-picker {
        background: #2b2b2b;
        display: block;
        border-radius: 3px;
        border: 1px solid black;
        padding: 4px;
    }

    .backbtn {
        color: white;
        background-color: black;
        border-radius: 2px;
        padding: 3px;
        text-decoration: none;
        border: none;
        height: 48px;
    }

    .extraoptionbtn {
        height: 48px;
        min-height: min-content;
        color: #ababab;
        border-radius: 0;
        background-color: #2c2c2c;
        border: 0;
        padding: 2px;
        margin: 2px
    }


    .arrows:disabled {
        cursor: not-allowed;
        color: #2b2b2b;
    }

</style>