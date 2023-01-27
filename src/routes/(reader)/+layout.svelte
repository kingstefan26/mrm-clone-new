<script>
    import Layout from '$lib/components/layout/readerLayout.svelte';
    import '../../app.css';
    import "@fontsource/public-sans";
</script>

<style>
    :global(*){
        font-family: "Public Sans", -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }
</style>

<Layout>
    <slot />
</Layout>