<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();


    function handleKeydown({ keyCode }) {
        if (keyCode !== 39 && keyCode !== 37) return;

        switch (keyCode) {
            case 39:
                dispatch("right");
                break;
            case 37:
                dispatch("left");
                break;
        }
    }

</script>

<svelte:window on:keydown={handleKeydown} />