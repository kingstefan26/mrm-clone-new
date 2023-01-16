<script>
    import '../../../app.css';
    import AdminNav from "$lib/components/admin/header/AdminNav.svelte";

    export let data

</script>

<AdminNav user={data.user} />

<slot />



<style>
    :global(*) {
        font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    }
</style>