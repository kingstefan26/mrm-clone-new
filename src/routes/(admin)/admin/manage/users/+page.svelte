<script>
    import UserWiget from "$lib/components/admin/users/UserWiget.svelte";

    export let data
</script>

<p class="max-w-2xl" style="overflow-wrap: break-word;">
    {JSON.stringify(data)}
</p>

<div class="flex">
    {#each data.users as user}
        <UserWiget {user} />
    {/each}
</div>
