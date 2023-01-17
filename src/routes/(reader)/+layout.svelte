<script>
    import Layout from '$lib/components/layout/readerLayout.svelte';
    import '../../app.css';
    import "@fontsource/public-sans";
</script>

<style>
    :global(*){
        font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }


    :global(a) {
        color: inherit;
    }

    :global(body){
        margin: 0;
    }

    @media (min-width: 400px) {
        :global(body) {
            font-size: 16px;
        }
    }
</style>

<Layout>
    <slot />
</Layout>