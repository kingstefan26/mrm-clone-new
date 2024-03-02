<script>
	import '../../../app.css';
	import AdminNav from '$lib/components/admin/header/AdminNav.svelte';

	export let data;
</script>

<main class="grid grid-rows-[auto,1fr] h-screen max-h-screen bg-stone-600">
	<nav>
		<AdminNav user={data.user} postCount={data.postCount} viewCount={data.viewCount} />
	</nav>

	<slot />
</main>

<style>
	:global(*) {
		/*font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;*/
		font-family: OpenSans, Helvetica, sans-serif;
	}

	:global(a) {
		color: white;
	}
	:global(body) {
		margin: 0;
	}
	@media (min-width: 400px) {
		:global(body) {
			font-size: 16px;
		}
	}
</style>
