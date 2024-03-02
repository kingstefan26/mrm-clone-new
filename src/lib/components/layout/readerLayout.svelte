<script>
	import SearchBox from '$lib/components/layout/header/SearchBox.svelte';
	import '@material/web/divider/divider.js';

	const footLinks = [
		{ Name: 'about', link: '/about/' },
		{ Name: 'privacy policy', link: '/privacy-policy/' },
		{ Name: 'terms service', link: '/' },
		{ Name: 'dmca notice', link: '/dmca-notice/' },
		{ Name: 'contact', link: '/contact/' },
		{ Name: 'my bookmark', link: '/' },
		{ Name: 'login', link: '/' }
	];
	// const navLinks = [
	// 	{ Name: 'BARA', link: '/' },
	// 	{ Name: 'MANGA', link: '/' },
	// 	{ Name: 'VIDEO', link: '/' },
	// 	{ Name: 'RANDOM', link: '/' },
	// 	{ Name: 'POPULAR', link: '/' },
	// 	{ Name: 'ASK', link: '/' },
	// 	{ Name: 'UPLOAD', link: '/' }
	// ];
</script>

<div class="w-screen h-screen max-w-full grid grid-rows-[auto,1fr,auto]">
	<nav class="pb-1" style="view-transition-name: header;">
		<div
			class="flex justify-center p-4 pb-10"
			style="background-color: var(--md-sys-color-secondary-container);"
		>
			<div
				class="grid max-w-screen-lg xl:grid-rows-none
				xl:grid-cols-2 w-full font-publicsans grid-rows-2"
			>
				<a href="/">
					<h1
						style="margin: 0 0 0.5em 0; line-height: 1.2;
						 color: var(--md-sys-color-secondary);"
						class="font-publicsans font-bold justify-self-center text-center text-3xl"
					>
						MyWebsite
					</h1>
				</a>
				<div class="justify-self-center w-full">
					<SearchBox />
				</div>
			</div>
		</div>
		<div
			class="w-full p-5 relative bottom-7"
			style="border-radius: 40px 40px 0 0;
			background-color: var(--md-sys-color-background);"
		/>
	</nav>

	<main style="background-color: var(--md-sys-color-background)">
		<slot />
	</main>

	<footer style="view-transition-name: footer;">
		<div
			class="wrapper grid-rows-[1fr,min-content] pb-10 pt-7 w-fill flex justify-center text-center text-xs"
		>
			<div class="container grid">
				<div class="flex justify-center max-w-screen-lg flex-wrap mb-10 w-full h-full">
					{#each footLinks as link}
						<div class="p-1.5">
							<a
								data-sveltekit-preload-data
								class="macolour"
								href={link.link}
								style="color: var(--md-sys-color-tertiary);"
							>
								{link.Name.toUpperCase()}
							</a>
						</div>
					{/each}
				</div>
				<div class="disclamers-container leading-5 mr-0.5 ml-0.5 font-publicsans">
					<p>Some Rights Reserved © TestCorp - Test, Test, Test, Test and Test Online</p>
					<p>
						TestSite is completely free - paid for by advertisers, purely for information purposes
						only. Strictly No Commercial Use. Credit where credit's due.
					</p>
				</div>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		background: var(--md-sys-color-background);
	}

	.disclamers-container > p {
		color: #c5c4c4;
	}
</style>
