<script>
    import Nav from '$lib/components/layout/header/Nav.svelte';
    import Foot from '$lib/components/layout/Footer.svelte';

</script>

<style>
    :global(body) {
        background: #343434;
    }
</style>

<div class="w-screen h-screen max-w-full grid grid-rows-[auto,1fr,auto]">
    <nav>
        <Nav/>
    </nav>
    <main>
        <slot></slot>
    </main>
    <footer>
        <Foot/>
    </footer>
</div>
