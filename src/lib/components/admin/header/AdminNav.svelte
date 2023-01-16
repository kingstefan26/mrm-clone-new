<script>
    import {onDestroy, onMount} from "svelte";

    export let user;
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

<div class="w-full h-24 min-h-fit border-b-4 dark:border-stone-800 flex dark:bg-stone-800 justify-between">
    <div class="mt-2 ml-1.5">
        <h3 class="font-medium text-2xl dark:text-white">Mrm-Admin-Panel</h3>
        <h4 class="font-extralight text-xl dark:text-white" > Logged in as whore {user.username}</h4>
    </div>
    <p class="font-extralight text-slate-900 dark:text-stone-400 m-auto">
        {#key toLaunch}
            Rocket Lauch in: {toLaunch}
        {/key}
        <br>
        Live Posts: 1203
        <br>
        24h Views: 24k
    </p>
    <a href="/admin" class="m-1 mr-4 p-2">
        <img src="/logo-192.png" class="max-w-full max-h-full" alt="company logo">
    </a>
</div>

<div class="w-full h-10 dark:bg-stone-700 flex justify-center">
    <a class="dark:text-white text-xl my-auto pl-2 pr-2 underline" href="/admin/posts">Manage Users</a>
    <a class="dark:text-white text-xl my-auto pl-2 pr-2 underline" href="/admin/posts">Manage Posts</a>
    <a class="dark:text-white text-xl my-auto pl-2 pr-2 underline" href="/admin/posts">Blah</a>
    <a class="dark:text-white text-xl my-auto pl-2 pr-2 underline" href="/admin/posts">Blah</a>
</div>