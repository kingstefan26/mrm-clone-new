<script>
    import {page} from '$app/stores';
</script>


<p class="text-center text-white text-2xl">
    Failed to get users
</p>
<p class="text-center text-white">message from server: {$page.error.message}</p>