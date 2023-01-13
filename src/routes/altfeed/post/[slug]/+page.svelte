<!-- http://localhost:1337/api/posts?filters[title][$eq]=City%20Boy%20to%20Seto%20no%20Shima%203&populate=chapters,localizations,chapter_media-->
<script>
    import Dobulepage from "./dobulepage.svelte";
    import Singlepage from "./singlepageview.svelte";
    import doublePageview from "$lib/shared/stores/doublepageview.js";
    import { cockpitOrgin } from "$lib/shared/host.js";


    export let data;

    const BASE_URL = cockpitOrgin;

    let savedata;


    const fetchchapter = (async () => {
        const chapters = [];
        if (!data.post) return chapters;


        // if (navigator) {
        //     if ("connection" in navigator) {
        //         if (navigator.connection.saveData === true) {
        //             savedata = true;
        //         }
        //     }
        //     if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        //         // true for mobile device
        //         savedata = true;
        //     }
        // }


        data.post.post.chapters.forEach(chapter => {
            let allmedia = [];

            chapter.chapter_media.forEach(media => {
                allmedia.push({
                    url: media.path.startsWith("http") ? media.path : "/asset" + media.path + (savedata ? "?q=1" : ""),
                    height: media.height,
                    width: media.width,
                    name: "hehe"
                });
            });


            chapters.push(allmedia);
        });

        return chapters;
    })();

    // import images from '$lib/shared/stores/images.js';


    async function getImage(url) {
        // console.log(url);
        // if ($images.has(url)) {
        //   return $images.get(url);
        // } else {
        //
        //   const response = await fetch(url);
        //   const blob = await response.blob();
        //   const image = URL.createObjectURL(blob);
        //
        //   $images.set(url, image);
        //   return image;
        //
        // }

        // if you ask why am i going to all that trouble to get the url,
        // well in case i do make the app offline i can have a centalied control of the urls
        return url;
    }


</script>


<svelte:head>
    {#if data.post}
        <title>{data.post.title} - Mrm-clone</title>
        {#if data.post.description}
            <meta name="description" content="{data.post.description}">
            <meta property="og:description" content="{data.post.description}">
            <meta property="twitter:description" content="{data.post.description}">
        {/if}
        {#if data.post.poster}
            <meta property="twitter:image" content="{BASE_URL + data.post.poster.path}">
            <meta property="og:image" content="{BASE_URL + data.post.poster.path}">
            <meta property="twitter:card" content="{BASE_URL + data.post.poster.path}">
        {/if}
        <meta name="title" content="{data.post.title}, read now on Mrm-clone">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{data.post.title}, read now on Mrm-clone">

        <meta property="twitter:title" content="{data.post.title}, read now on Mrm-clone">
    {/if}

    <meta property="twitter:url" content="https://mrm-clone.vercel.app/">

</svelte:head>


{#if ($doublePageview)}
    <Dobulepage {doublePageview} {fetchchapter} {data} {getImage} />
{:else }
    <Singlepage {doublePageview} {fetchchapter} {data} {getImage} />
{/if}
