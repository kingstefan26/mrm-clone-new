<script>
    import {fade, fly} from 'svelte/transition';

    export let expanded = false

    function closePopup() {
        expanded = false
    }
</script>

<slot name="alwaysVisible" />

{#if expanded}
    <div class="overlay multipageContainer z-10">
        <div class="popup"
             in:fly="{{ y: 10, duration: 100 }}"
             out:fade="{{ duration: 200 }}"
        >
            <button class="button" on:click={() => {closePopup()}}>
                🚫
            </button>
            <slot name="content" />
        </div>
    </div>
{/if}

<style>
    .button {
        font-family: Helvetica, Arial, sans-serif;
        font-size: 13px;
        padding: 5px 10px;
        border: 1px solid #aaa;
        background-color: #eee;
        background-image: linear-gradient(top, #fff, #f0f0f0);
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        color: #666;
        text-decoration: none;
        text-shadow: 0 1px 0 #fff;
        cursor: pointer;
        transition: all 0.2s ease-out;
    }

    .overlay {
        position: absolute;
        width: 100vw;
        height: 100vh;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.40);
        transition: opacity 200ms;
    }

    .popup {
        position: relative;
        margin-top: 300px;
        margin-right: auto;
        margin-left: auto;
        margin-bottom: auto;
        padding: 20px;
        color: white;
        background: #57534e;
        border: 1px solid #666;
        width: 80%;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
    }

    .multipageContainer {
        display: grid;
        align-items: start;
    }

</style>