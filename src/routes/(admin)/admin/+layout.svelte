<script>
	import '../../../app.css';
	import { enhance } from '$app/forms';

	/** @type {import('./$types').LayoutData} */
	export let data;

	import {
		argbFromHex,
		themeFromSourceColor,
		applyTheme
	} from '@material/material-color-utilities';
	import { onMount } from 'svelte';
	import logo from '$lib/img/logo-128.png';

	onMount(() => {
		const theme = themeFromSourceColor(argbFromHex('#114086'));
		applyTheme(theme, { target: document.body, dark: true });
	});

	let postCount = data.postCount;

	// view count but add k M suffixes
	let viewCountFormated = data.viewCount;
	$: {
		if (data.viewCount > 1000) {
			viewCountFormated = (data.viewCount / 1000).toFixed(1) + 'k';
		}
		if (data.viewCount > 1000000) {
			viewCountFormated = (data.viewCount / 1000000).toFixed(1) + 'M';
		}
	}
	let liveUpdating = false;
</script>

<main class="grid grid-rows-[auto,1fr] h-screen max-h-screen bg-[var(--md-sys-color-background)]">
	<div>
		<div class=" w-full grid bg-[var(--md-sys-color-secondary-container)] grid-cols-[2fr,2fr,3fr]">
			<div class="mt-2 ml-1.5">
				<h3 class="font-bold text-2xl text-[var(--md-sys-color-on-secondary-container)]">
					Admin Panel
				</h3>
				<h4 class="font-publicsans text-[var(--md-sys-color-on-secondary-container)]">
					{#if data.user}
						Logged in as {data.user.username},
						<form action="/admin/login?/logout" method="POST" use:enhance>
							<button type="submit">Logout</button>
						</form>
					{:else}
						Not logged in
					{/if}
				</h4>
			</div>
			<div class="text-[var(--md-sys-color-on-secondary-container)] my-auto">
				<div class="grid">
					Live Posts
					{#if liveUpdating}
						<div>
							<div class="font-[var(--md-sys-color-on-tertiary-container)] text-center">
								{postCount}
								<span class="flex text-lg flex items-center text-red-700 font-bold uppercase">
									<span class="w-3 h-3 mr-3 relative live_icon" /> ORNOT
								</span>
							</div>
						</div>
					{:else}
						0
					{/if}
				</div>
				<div class="flex">
					24h Views
					{#if liveUpdating}
						<div>
							{viewCountFormated}
						</div>
					{:else}
						0
					{/if}
				</div>
			</div>
			<a href="/admin" class="">
				<img src={logo} class="max-h-[4.5em] float-right p-1" alt="company logo" />
			</a>
		</div>

		<div class="w-full min-h-10 bg-[var(--md-sys-color-secondary-container)] flex justify-center">
			<a class="text-white text-xl my-auto pl-2 pr-2 underline" href="/admin/manage/users"
				>Manage Users</a
			>
			<a class="text-white text-xl my-auto pl-2 pr-2 underline" href="/admin/manage/posts"
				>Manage Posts</a
			>
			<a class="text-white text-xl my-auto pl-2 pr-2 underline" href="/admin/manage/authors"
				>Manage Authors</a
			>
			<a class="text-white text-xl my-auto pl-2 pr-2 underline" href="/admin/manage/posts">Blah</a>
		</div>
	</div>

	<slot />
</main>

<style>
	:global(*) {
		/*font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;*/
		font-family: OpenSans, Helvetica, sans-serif;
	}

	.live_icon:before {
		content: '';
		display: block;
		width: 300%;
		height: 300%;
		box-sizing: border-box;
		margin-left: -100%;
		margin-top: -100%;
		border-radius: 100%;
		background-color: #c53030;
		animation: live-icon-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
	}
	.live_icon:after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		display: block;
		width: 100%;
		height: 100%;
		background-color: #c53030;
		border-radius: 100%;
		box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
		animation: live-icon-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
	}

	@keyframes live-icon-ring {
		0% {
			transform: scale(0.33);
		}
		80%,
		100% {
			opacity: 0;
		}
	}
	@keyframes live-icon-dot {
		0% {
			transform: scale(0.8);
		}
		50% {
			transform: scale(1);
		}
		100% {
			transform: scale(0.8);
		}
	}
</style>
