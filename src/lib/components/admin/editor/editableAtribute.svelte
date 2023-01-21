<script>
    export let name
    export let attribute
</script>

<div class="flex justify-between max-w-[300px] text-white h-6 bg-stone-500 border-[1px]">
    <p>{name}:</p>
    <input class="max-h-max p-1 bg-stone-700 text-white" type="text" placeholder="{attribute}" bind:value={attribute}>
</div>

