<script>
    export let name
    export let checked = false
    export let loading = false

    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    function forward(event) {
        checked = event.target.checked
        dispatch('save', {
            checked
        });
    }
</script>

<div class="m-1 text-white bg-stone-500 w-max pl-2 pr-2">
    <label>{name}</label>
    <input disabled={loading}
            on:click={forward}
            class="max-h-max p-1 bg-stone-700 text-white"
            type="checkbox"
            bind:checked={checked}>
</div>