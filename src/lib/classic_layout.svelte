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
        display: grid;
        grid-template-rows: auto 1fr auto;
    }
    main {
        position: relative;
        background: #343434;
        padding-top: 2%;
        padding-bottom: 2%;
        width: 100%;
        max-width: 100%;
         /*overflow-x: hidden;*/
        margin: 0 auto;
        box-sizing: border-box;
    }
</style>


<div id="wrapper" class="w-screen">
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
