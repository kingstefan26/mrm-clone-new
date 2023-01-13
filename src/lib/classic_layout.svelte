<script>

    import Nav from '$lib/header/Nav.svelte';
    import Foot from '$lib/Footer.svelte';

</script>

<style>
    :global(body) {
        background: #343434;
    }

    #wrapper {
        height: 100vh;
        width: 100vw;
        display: grid;
        grid-template-rows: auto 1fr auto;
    }
    main {
        position: relative;
        max-width: 56em;
        background: #343434;
        padding-top: 2%;
        padding-bottom: 2%;
        width: 100%;
        max-width: 100%;
        /* overflow-x: hidden; */

        margin: 0 auto;
        box-sizing: border-box;
    }
</style>


<div id="wrapper">
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
