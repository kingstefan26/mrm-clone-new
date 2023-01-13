<script>
    import PostWidget from "./PostWiget.svelte";

    import Spinner from "$lib/spiner.svelte";

    import {cockpitOrgin} from "$lib/shared/host.js";

    import {onMount} from "svelte";

    const BASE_URL = cockpitOrgin;
    const BASE_IMAGE_URL = `${BASE_URL}/storage/uploads`;

    let iserrror = false;

    const fetchcocks = async () => {

        console.log('featching cocks');

        // let json = await fetch("/altfeed/api").then(res => res.json());

        // if (!json.entries) {
        // let json = JSON.parse('{"entries":[{"_id":"62426f66aad26860dd2b9182","title":"test","author":"test","chapters":[{"_id":"62426f4377b2de1b8f62a652","name":"test","chapter_media":[{"meta":{"title":"","asset":"62426f38bb7e4767a6400222"},"path":"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/index.png?v=1648708320976"},{"meta":{"title":"","asset":"62426f38c0488a43543d8b72"},"path":"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/vertical.png?v=1648708320939"},{"meta":{"title":"","asset":"62426f38cede4a53cb211d82"},"path":"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/horisontal.png?v=1648708321328"}],"_mby":"623f7bda63ec7431f5343042","_by":"623f7bda63ec7431f5343042","_modified":1648521027,"_created":1648521027,"_link":"chapters"},{"_id":"62426f50625b7b3d560d9a02","name":"test2","chapter_media":[{"meta":{"title":"","asset":"62426f38bb7e4767a6400222"},"path":"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/index.png?v=1648708320976"},{"meta":{"title":"","asset":"62426f38c0488a43543d8b72"},"path":"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/vertical.png?v=1648708320939"},{"meta":{"title":"","asset":"62426f38cede4a53cb211d82"},"path":"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/horisontal.png?v=1648708321328"}],"_mby":"623f7bda63ec7431f5343042","_by":"623f7bda63ec7431f5343042","_modified":1648521040,"_created":1648521040,"_link":"chapters"}],"poster":{"path":"https://cdn.glitch.global/17cc8f98-08bf-484d-a833-5a8e854d7d9f/vertical.png?v=1648708320939"},"_mby":"623f7bda63ec7431f5343042","_by":"623f7bda63ec7431f5343042","_modified":1648521062,"_created":1648521062}],"total":1}')
        // }

        const json = {
            entries: [
                {
                    id: "123",
                    title: "Gladiolus",
                    author: "atcesolcyc",
                    created: 1673583067,
                    geners: ["Bara/ Muscle", "Yaoi"],
                    tags: ["Big Penis", "Tattoo", "Uncensored"],
                    categories: ["CG/ Art"],
                    chapters: [
                        {
                            id: "testid2",
                            name: "first",
                            chapter_media: [
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/0.jpg",
                                    "height": 825,
                                    "width": 989
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/1.jpg",
                                    "height": 1047,
                                    "width": 845
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/2.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/3.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/4.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/5.jpg",
                                    "height": 1210,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/6.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/7.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/8.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/9.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/10.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/11.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/12.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/13.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/14.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/15.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/16.jpg",
                                    "height": 1178,
                                    "width": 950
                                },
                                {
                                    "path": "/[atcesolcyc]%20Gladiolus/17.jpg",
                                    "height": 1178,
                                    "width": 950
                                }

                            ]
                        }
                    ],
                    "poster": {
                        "path": "/asset/[atcesolcyc] Gladiolus/0.jpg"
                    }
                },
                {
                    id: "321",
                    title: "Jogging",
                    author: "Tarutoru",
                    created: 1673583067,
                    geners: ["Bara/ Muscle", "Yaoi"],
                    tags: ["Blowjob", "Public Sex/ Exhibitionism"],
                    categories: ["CG/ Art"],
                    chapters: [
                        {
                            id: "testid2",
                            name: "first",
                            chapter_media: [
                                {
                                    "path": "/Tarutoru_Jogging/1.jpg",
                                    "height": 1000,
                                    "width": 1331
                                },
                                {
                                    "path": "/Tarutoru_Jogging/2.jpg",
                                    "height": 1000,
                                    "width": 1331
                                },
                                {
                                    "path": "/Tarutoru_Jogging/3.jpg",
                                    "height": 1000,
                                    "width": 1331
                                },
                                {
                                    "path": "/Tarutoru_Jogging/4.jpg",
                                    "height": 1000,
                                    "width": 1331
                                },
                                {
                                    "path": "/Tarutoru_Jogging/5.jpg",
                                    "height": 1210,
                                    "width": 1331
                                },
                                {
                                    "path": "/Tarutoru_Jogging/6.jpg",
                                    "height": 1000,
                                    "width": 1331
                                },
                                {
                                    "path": "/Tarutoru_Jogging/7.jpg",
                                    "height": 1000,
                                    "width": 1483
                                },
                                {
                                    "path": "/Tarutoru_Jogging/8.jpg",
                                    "height": 1000,
                                    "width": 1483
                                },
                                {
                                    "path": "/Tarutoru_Jogging/9.jpg",
                                    "height": 1000,
                                    "width": 1483
                                },
                                {
                                    "path": "/Tarutoru_Jogging/10.jpg",
                                    "height": 1000,
                                    "width": 1483
                                },
                                {
                                    "path": "/Tarutoru_Jogging/11.jpg",
                                    "height": 1000,
                                    "width": 1483
                                },
                                {
                                    "path": "/Tarutoru_Jogging/12.jpg",
                                    "height": 1000,
                                    "width": 1483
                                },
                                {
                                    "path": "/Tarutoru_Jogging/13.jpg",
                                    "height": 1000,
                                    "width": 1483
                                },
                                {
                                    "path": "/Tarutoru_Jogging/14.jpg",
                                    "height": 1000,
                                    "width": 1483
                                }
                            ]
                        }
                    ],
                    "poster": {
                        "path": "/asset/Tarutoru_Jogging/1.jpg"
                    }
                }
            ],
            total:2
        }

        const posts = [];

        for (const post of json.entries) {
            posts.push({
                id: post._id,
                author: post.author,
                lang: post.lang,
                title: post.title,
                coverpicurl: post.poster.path,
                chapter_count: post.chapter_count
            });
        }


        return posts;
    };

    onMount(() => {
        // if running in a browser, cache in session storage
        if (window) {
            const cachedFeed = sessionStorage.getItem("feed");
            if (cachedFeed) {
                const json = JSON.parse(cachedFeed);
                if (!json.length) {
                    iserrror = true;
                    return;
                }
                feed = json;
            } else {
                feed = fetchcocks().then(cocks => {
                    sessionStorage.setItem("feed", JSON.stringify(cocks));
                    return cocks
                })
            }
        } else {
            feed = fetchcocks();
        }
    });

    let feed;

</script>

<style>

    .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        overflow: hidden;
        max-width: 100%;
    }

    .error {
        text-align: center;
    }

    #refresh {
        color: black;
    }

</style>


<svelte:head>
    <title>AltFeed</title>
</svelte:head>

<section>
    <button id="refresh" on:click={() => {sessionStorage.removeItem("feed"); location.reload();}}>
        Refresh cache
    </button>
</section>

{#if feed}
    {#await feed}
        <div style="display: flex; justify-content: center; align-content: center; height: 100%">
            <Spinner/>
        </div>
    {:then feed}
        <div class="content">
            {#each feed as item}
                <div style="flex-basis: min-content; margin: 5px">
                    <PostWidget post={item}/>
                </div>
            {/each}
        </div>
    {:catch err}
        <div class="error">
            <h1>Error</h1>
            <p>Something went wrong.</p>
        </div>
    {/await}
{:else}
    <div style="display: flex; justify-content: center; align-content: center; height: 100%">
        <Spinner/>
    </div>
{/if}




