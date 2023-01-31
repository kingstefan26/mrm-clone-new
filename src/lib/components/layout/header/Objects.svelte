<script>
    export let object = {
        type: "",
        contents: {}
    };
</script>

<li on:mousedown>
    {#if object.type === "post"}
        <div class="flex flex-row">
            {object.contents.title}
            <img src="/api/asset/proxy/{object.contents.posterAssetId}" width="60" class="object-cover">
        </div>
    {:else}
        {object.type}
    {/if}
</li>

<style>
    li {
        width: 100%;
        list-style: none;
        /*border: 1px solid #d4d4d4;*/
        margin: 0;
        padding: 10px;
        cursor: pointer;
        background-color: #fff;
        display: block;
    }
    li:hover {
        background-color: lightgray;
    }
</style>