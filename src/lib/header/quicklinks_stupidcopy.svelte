<script>
    export let links = [
        {
            Name: undefined,
            link: undefined
        }
    ];
</script>


<div class="wrapper">
    <div id="quick-links">
        {#each links as link}
            <div class="quick-link-element">
                <a data-sveltekit-preload-data class="link" href={link.link}> {link.Name.toUpperCase()} </a>
            </div>
        {/each}
    </div>
</div>


<style>
    .wrapper {
        display: flex;
        justify-content: center;
    }

    #quick-links {
        width: 100%;
        max-width: 1024px;

        max-height: min-content;
        overflow: hidden;
        margin-bottom: 10px;
        display: flex;
        flex-wrap: wrap;
    }

    @media screen and (min-width: 1024px){
        #quick-links {
            justify-content: flex-start;
        }
    }
    @media screen and (max-width: 1024px){
        #quick-links {
            justify-content: center;
        }
    }

    .quick-link-element {
        padding: 2px;
        padding-left: 10px;
        padding-right: 10px;
        margin-left: 10px;
        margin-right: 10px;
        margin: 3px;
    }

    .link {
        text-decoration: none;
        color: #999;

        font-size: 16px;
        font-weight: 700;
        line-height: 1.5;
    }

    .link:hover {
        color: #fff;
        text-decoration: none;
    }

</style>