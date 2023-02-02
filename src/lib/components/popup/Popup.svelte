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

</script>

<slot name="alwaysVisible"/>

<dialog bind:this={dialog} on:close={closedDialog} in:fly="{{ y: 10, duration: 100 }}" out:fade="{{ duration: 200 }}">
    <div class="popup multipageContainer">
        <button class="button rounded-none " on:click={closePopup}>🚫</button>
        <slot name="content"/>
    </div>
</dialog>

<style>
    .button {
        border: 1px solid #aaa;
        background-color: #eee;
    }

    dialog::backdrop {
        background: rgba(0, 0, 0, 0.40);

    }

    dialog {
        padding: 0;
        transition: opacity 200ms;
    }

    .popup {
        position: relative;
        padding: 20px;
        color: white;
        background: #57534e;
        border: 1px solid #666;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
    }

    .multipageContainer {
        display: grid;
        align-items: start;
    }

</style>