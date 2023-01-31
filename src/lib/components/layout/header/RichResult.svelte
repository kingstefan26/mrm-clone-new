<script>
    export let result = {
        type: "",
        contents: {}
    };
</script>


{#if result.type === "post"}
    <!--Show the content in a thing like twitter typeahead using tailwind-->
    <li class="post">
        <h1>Post</h1>
        <p>{result.contents.title}</p>
    </li>
{:else if result.type === "success"}
    <li class="success">
        <h1>Success</h1>
        <p>{result.contents.message}</p>
    </li>
{/if}

<style>
    li {
        z-index: 0;
    }
</style>