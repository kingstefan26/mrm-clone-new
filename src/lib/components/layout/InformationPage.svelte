<script>
    export let pagetitle = "Info";
</script>

<svelte:head>
    <title>{pagetitle}</title>
</svelte:head>

<div class="container">
    <slot></slot>
</div>


<style>
    .container {
        font-family: helvetica neue,Helvetica,Arial,sans-serif;
        color: #c5c4c4;
        /* padding: 5% 3% 5% 3% ; */
        max-width: 1080px;
        width: auto;
        text-align: left;
        word-wrap: break-word;
    }

    .container :global(h1) {
        font-weight: 800;
        font-size: 24px;
    }

    @media screen and (min-width: 1024px){
        .container {
            padding: 5% 20% 5% 20%;
        }
    }
    @media screen and (max-width: 1024px){
        .container {
            padding: 5% 3% 5% 3% ;
        }
    }

</style>