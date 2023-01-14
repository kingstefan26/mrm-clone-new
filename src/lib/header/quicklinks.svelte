<script>
    export let links;
</script>


<div class="mx">
    <div class="flex justify-center max-w-screen-lg items-center flex-wrap mb-10 w-max max-h-max">
        {#each links as link}
            <div class="quick-link-element pt-10 pr-20 pl-20 pb-10">
                <a sveltekit:prefetch class="link text-xs font-bold text-gray-700 font-extrabold hover:text-white no-underline" href={link.link}> {link.Name.toUpperCase()} </a>
            </div>
        {/each}
    </div>
</div>


<style>
    /*shout out to tailwind for not working*/
    .flex {
        display: flex;
    }
    .justify-center {
        justify-content: center;

    }
    .font-bold {
        font-weight: 700;
    }

    .no-underline {
        text-decoration: none;
    }

    .pt-10 {
        padding-top: 10px;
    }
    .pr-20 {
        padding-right: 20px;
    }
    .pl-20 {
        padding-left: 20px;
    }
    .pb-10 {
        padding-bottom: 10px;
    }

    .text-gray-700 {
        color: #999;
    }
</style>