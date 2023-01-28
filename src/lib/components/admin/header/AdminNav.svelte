<script>
    import {onDestroy, onMount} from "svelte";

    export let viewCount
    export let postCount

    // view count but add k M suffixes
    let viewCountFormated = viewCount
    $: {
        if (viewCount > 1000) {
            viewCountFormated = (viewCount / 1000).toFixed(1) + 'k'
        }
        if (viewCount > 1000000) {
            viewCountFormated = (viewCount / 1000000).toFixed(1) + 'M'
        }
    }


    export let user = {
        username: undefined
    };

    onMount(() => {
        let now = Math.floor(Date.now() / 1000)
        let when = now + 3600
        toLaunch = new Date(36000).toTimeString().split(' ')[0]
        updateIntv = setInterval(() => {
                now = Math.floor(Date.now() / 1000)
                toLaunch = new Date((when - now) * 1000).toTimeString().split(' ')[0]
                // toLauch = when - now
            },
            1000)
    })
    onDestroy(() => {
        clearInterval(updateIntv)
    })

    let updateIntv
    let toLaunch

</script>

<div class="w-full h-24 min-h-fit border-b-4 border-stone-800 flex bg-stone-800 justify-between">
    <div class="mt-2 ml-1.5">
        <h3 class="font-medium text-2xl text-white">Mrm-Admin-Panel</h3>
        <h4 class="font-extralight text-xl text-white" >

            {#if user.username}
                Logged in as {user.username}
                {:else}
                Not logged in
            {/if}

        </h4>
    </div>
    <p class="font-extralight text-slate-900 text-stone-400 m-auto">
        {#key toLaunch}
            Rocket Lauch in: {toLaunch}
        {/key}
        <br>
        Live Posts: {postCount}
        <br>
        24h Views: {viewCountFormated}
    </p>
    <a href="/admin" class="p-2">
        <img src="/logo-192.png" class="max-w-full max-h-full mx-auto" alt="company logo">
    </a>
</div>

<div class="w-full h-10 bg-stone-700 flex justify-center">
    <a class="text-white text-xl my-auto pl-2 pr-2 underline" href="/admin/manage/users">Manage Users</a>
    <a class="text-white text-xl my-auto pl-2 pr-2 underline" href="/admin/manage/posts">Manage Posts</a>
    <a class="text-white text-xl my-auto pl-2 pr-2 underline" href="/admin/manage/posts">Blah</a>
    <a class="text-white text-xl my-auto pl-2 pr-2 underline" href="/admin/manage/posts">Blah</a>
</div>