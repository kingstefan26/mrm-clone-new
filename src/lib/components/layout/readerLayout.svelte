<script>
	import SearchBox from '$lib/components/layout/header/SearchBox.svelte';

	const footLinks = [
		{ Name: 'about', link: '/about/' },
		{ Name: 'privacy policy', link: '/privacy-policy/' },
		{ Name: 'terms service', link: '/' },
		{ Name: 'dmca notice', link: '/dmca-notice/' },
		{ Name: 'contact', link: '/contact/' },
		{ Name: 'my bookmark', link: '/' },
		{ Name: 'login', link: '/' }
	];
	const navLinks = [
		{ Name: 'BARA', link: '/' },
		{ Name: 'MANGA', link: '/' },
		{ Name: 'VIDEO', link: '/' },
		{ Name: 'RANDOM', link: '/' },
		{ Name: 'POPULAR', link: '/' },
		{ Name: 'ASK', link: '/' },
		{ Name: 'UPLOAD', link: '/' }
	];
</script>

<div class="w-screen h-screen max-w-full grid grid-rows-[auto,1fr,auto]">
	<nav>
		<div
			class="flex justify-center p-4"
			style="background-color: #2b2b2b; border-bottom: 5px solid #f15123;"
		>
			<div
				class="m-0 grid max-w-screen-lg xl:grid-rows-none xl:grid-cols-2 w-full font-publicsans grid-rows-2"
			>
				<a href="/">
					<h1
						style="margin: 0 0 0.5em 0; line-height: 1.2; color: #abb1b3;"
						class="font-publicsans font-extrabold site-title font-bold justify-self-center text-center text-3xl"
					>
						MyWebsite
					</h1>
				</a>
				<div class="justify-self-center w-full">
					<SearchBox />
				</div>
			</div>
		</div>

		<div style="box-shadow: 1px 1px 1px #000; background-color: #333;">
			<div class="flex justify-center max-w-screen-lg flex-wrap mb-10 w-full h-full">
				{#each navLinks as link}
					<div class="pt-2 pl-3 pr-3 pb-5">
						<a
							data-sveltekit-preload-data
							class="font-publicsans text-lg font-bold macolour font-extrabold hover:text-white no-underline"
							href={link.link}
						>
							{link.Name.toUpperCase()}
						</a>
					</div>
				{/each}
			</div>
		</div>
	</nav>
	<main>
		<slot />
	</main>
	<footer>
		<div
			class="wrapper grid-rows-[1fr,min-content] pb-10 pt-7 w-fill flex justify-center text-center text-xs"
		>
			<div class="container grid">
				<div class="flex justify-center max-w-screen-lg flex-wrap mb-10 w-full h-full">
					{#each footLinks as link}
						<div class="p-1.5">
							<a
								data-sveltekit-preload-data
								class="text-base font-bold macolour font-extrabold hover:text-white no-underline"
								href={link.link}
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
		background: #343434;
	}
	.disclamers-container > p {
		color: #c5c4c4;
	}
	.wrapper {
		background-color: #2b2b2b;
		border-top: 5px solid #f15123;
	}
	.macolour {
		color: #b4b4b4;
	}
	.macolour {
		color: #cacaca;
	}
</style>
