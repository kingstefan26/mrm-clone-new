<script>
    export let links = [
        {
            Name: undefined,
            link: undefined
        }
    ];
</script>


<div class="flex justify-center max-w-screen-lg flex-wrap mb-10 w-full h-full">
    {#each links as link}
        <div class="pt-2 pl-3 pr-3 pb-5">
            <a data-sveltekit-preload-data
               class="text-lg font-bold macolour font-extrabold hover:text-white no-underline"
               href={link.link}> {link.Name.toUpperCase()} </a>
        </div>
    {/each}
</div>


<style>
    .macolour {
        color: #cacaca;
    }
</style>