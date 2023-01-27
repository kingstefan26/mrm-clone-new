<script>
    import {page} from '$app/stores';
</script>


<p class="text-center text-white text-2xl">
    No posts? <a class="underline italic font-light " href="/admin/manage/posts/create">create one</a>
</p>
<p class="text-center text-white">message from server: {$page.error.message}</p>