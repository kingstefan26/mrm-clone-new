<script>
    import {fade, fly} from 'svelte/transition';

    export let expanded = false

    function closePopup() {
        expanded = false
    }

    let dialog;
    $: if (dialog) {
        if (expanded) {
            expanded = true
            dialog.showModal()
        }

        if (!expanded) {
            expanded = false
            dialog.close()
        }
    }

    function closedDialog() {
        expanded = false
    }

    // https://stackoverflow.com/a/57463812/19259941
    function dialogClickHandler(e) {
        const rect = e.target.getBoundingClientRect();

        const clickedInDialog = (
            rect.top <= e.clientY &&
            e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX &&
            e.clientX <= rect.left + rect.width
        );

        if (clickedInDialog === false)
            e.target.close();
    }

</script>

<slot name="alwaysVisible"/>

<dialog on:click={dialogClickHandler} bind:this={dialog} on:close={closedDialog}>
    <div class="popup multipageContainer" in:fly="{{ y: 10, duration: 100 }}" out:fade="{{ duration: 200 }}">
        <button class="button rounded-none bg-stone-500 px-2 py-0 hover:bg-stone-600 hover:transition-colors" on:click={closePopup}>
            Close
        </button>
        <div class="adasdwad">
            <slot name="content"/>
        </div>
    </div>
</dialog>

<style>
    .adasdwad {
        grid-column: span 2;
    }
    .button {
        width: 100%;
        height: 100%;
        border: 1px solid #aaa;
    }

    dialog::backdrop {
        background: rgba(0, 0, 0, 0.40);
    }

    dialog {
        min-height: 40%;
        min-width: 60%;
        padding: 0;
        transition: opacity 200ms;
        background: #57534e;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
        border: 1px solid #666;
    }

    .popup {
        width: 100%;
        height: 100%;
        position: relative;
        padding: 1em;
        color: white;
    }

    .multipageContainer {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: 30px auto;
        align-items: start;
    }

</style>