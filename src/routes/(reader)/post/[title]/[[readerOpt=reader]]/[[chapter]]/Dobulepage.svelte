<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	import '@material/web/checkbox/checkbox.js';
	import '@material/web/button/outlined-button.js';
	import '@material/web/iconbutton/icon-button.js';
	import '@material/web/select/filled-select.js';
	import '@material/web/select/select-option.js';
	import '@material/web/icon/icon.js';
	import '@material/web/button/filled-tonal-button.js';
	import { hashCode, transision_hashcode } from '$lib/api/string-hashcode.js';
	import { assetidToUrl } from '$lib/api/assetid.js';

	export let chapter;
	export let post;
	export let current_chapter;

	let page_transisiton_id = transision_hashcode(hashCode(post.title));

	function handleKeydown({ keyCode }) {
		if (keyCode !== 39 && keyCode !== 37) return;

		switch (keyCode) {
			case 39:
				currentimage = getnextimage();
				break;
			case 37:
				currentimage = getpreviosimage();
				break;
		}
	}

	let alreadyPreloaded = [];

	const preloadImage = (url) => {
		if (alreadyPreloaded.includes(url)) return;
		const image = new Image();
		image.rel = 'reload';
		image.as = 'image';
		image.src = url;
		if (!image.complete) {
			image.onload = () => {
				console.log(`loaded ${url}`);
			};
		}

		console.log(`preloading ${url}`);
		alreadyPreloaded.push(url);
	};

	const getpreviosimage = () => {
		// if we are not at the start
		if (currentimage > 0) {
			return currentimage - 1;
		} else {
			// if we are at the start
			// check if current chapter is 0
			// if so return current image
			if (current_chapter > 0) {
				// if we go back a chapter is it null
				if (current_chapter - 1 >= 0) {
					// if the previuos chapter is the start or something after that
					// go back a chapter
					current_chapter -= 1;
					// and return the end of the previos (now current) chapter
					return chapter.assets.length - 1;
				}
			} else {
				return currentimage;
			}
		}
	};

	const getnextimage = () => {
		// if current image + 1 exisist switch to it
		const nextImageIndex = currentimage + 1;
		if (nextImageIndex < chapter.assets.length) {
			// does next image exists

			// if the image after that exists preload it
			const imageAfterThat = chapter.assets[currentimage + 2];
			if (imageAfterThat) {
				preloadImage(assetidToUrl(imageAfterThat.id));
			}

			// return the image index to be displayed
			return nextImageIndex;
		} else if (current_chapter + 1 < post.chapter_count) {
			// next image does not exist, check for next chapter

			// reset image state to beginning
			currentimage = 0;

			// navigate to next chapter
			current_chapter += 1;
			return currentimage;
		}

		return currentimage;
	};

	let currentimage = 0;

	let fullscreencontainer;
	let isFullScreen = false;

	function togglefullscreen() {
		const fullscreenSupport = document.fullscreenEnabled;

		if (!fullscreenSupport) return;

		if (!isFullScreen) {
			const requestFS = fullscreencontainer.requestFullscreen.bind(fullscreencontainer);

			requestFS();
		} else {
			const exitFullscreen = document.exitFullscreen.bind(document);
			exitFullscreen(fullscreencontainer);
		}

		isFullScreen = !isFullScreen;
	}

	onMount(() => {
		const bookmarks = localStorage.getItem('bookmarks');
		if (bookmarks) {
			let bookmarkobj = JSON.parse(bookmarks);

			const thisstorybooksmarks = bookmarkobj.filter((bookmark) => bookmark.id === post.id);

			let largestchapter = 0;
			let largestimage = 0;

			thisstorybooksmarks.forEach((bookmark) => {
				if (bookmark.chapter > largestchapter) {
					largestchapter = bookmark.chapter;
				}
				if (bookmark.image > largestimage) {
					largestimage = bookmark.image;
				}
			});

			current_chapter = largestchapter;
			currentimage = largestimage;
		}
	});

	function handlethaclick(e) {
		let clicked = window.innerWidth / 2 < e.clientX;
		// true = right , false = left
		if (clicked) {
			currentimage = getnextimage();
		} else {
			currentimage = getpreviosimage();
		}
	}

	function absorbEvent_(event) {
		const e = event || window.event;
		e.preventDefault && e.preventDefault();
		e.stopPropagation && e.stopPropagation();
		e.cancelBubble = () => {};
		e.returnValue = false;
		return false;
	}

	$: current_chapter, (currentimage = 0);
</script>

<svelte:window on:keydown={handleKeydown} />

<div id="container" bind:this={fullscreencontainer}>
	<div class="grid grid-cols-[auto,1fr,auto] pl-3 pr-3 m-4">
		<div>
			<md-icon-button
				on:click={() => {
					goto(`/post/${post.id}/0`);
				}}
				on:keyup={(e) => {
					if (e.key === 'Enter') {
						goto(`/post/${post.id}/0`);
					}
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						goto(`/post/${post.id}/0`);
					}
				}}
			>
				<span class="material-symbols-outlined"> arrow_back </span>
			</md-icon-button>
		</div>

		<span
			id="title"
			style="view-transition-name: post-title-reader"
			class="font-publicsans font-bold text-[#c5c4c4] text-xl max-w-max mx-auto"
		>
			{post.title}
		</span>

		<md-icon-button
			on:click={togglefullscreen}
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					togglefullscreen();
				}
			}}
			on:keyUp={(e) => {
				if (e.key === 'Enter') {
					togglefullscreen();
				}
			}}
			title="FullScreen Toggle"
		>
			{#if isFullScreen}
				<span class="material-symbols-outlined"> fullscreen_exit </span>
			{:else}
				<span class="material-symbols-outlined"> fullscreen </span>
			{/if}
		</md-icon-button>

		<div class="col-span-3">
			{#if post.chapterCount === 0}
				<label
					class="font-noto font-extrabold"
					style="color: var(--md-sys-color-secondary)"
					for="chapter_selector">Current Chapter</label
				>
				<input
					bind:value={current_chapter}
					type="number"
					name="Current Chapter"
					id="chapter_selector"
					min="0"
					max={post.chapterCount - 1}
				/>
			{/if}

			<label class="font-noto" style="color: var(--md-sys-color-secondary)" for="chapter_selector"
				>Current Page</label
			>
			<input
				type="number"
				name="Current Page"
				id="page_selector"
				min="0"
				max={chapter.assets.length - 1}
				bind:value={currentimage}
			/>
		</div>
	</div>

	<div class="content">
		{#if chapter}
			<div
				class="body"
				on:ontouchstart={absorbEvent_}
				on:ontouchmove={absorbEvent_}
				on:ontouchend={absorbEvent_}
				on:ontouchcancel={absorbEvent_}
				on:mousedown={absorbEvent_}
				on:contextmenu={absorbEvent_}
				on:keydown={absorbEvent_}
				on:keyup={absorbEvent_}
				on:click|preventDefault={(e) => handlethaclick(e)}
			>
				{#key currentimage}
					{#if currentimage === 0}
						<img
							src="/api/asset/proxy/{chapter.assets[currentimage].id}"
							alt={currentimage}
							style="view-transition-name: poster-{page_transisiton_id}"
						/>
					{:else if !currentimage}
						<img
							in:fly|global={{ x: 10, duration: 300, delay: 50 }}
							src="/api/asset/proxy/{chapter.assets[0].id}"
							alt={0}
						/>
					{:else}
						<img
							in:fly|global={{ x: 10, duration: 300, delay: 50 }}
							src="/api/asset/proxy/{chapter.assets[currentimage].id}"
							alt={currentimage}
						/>
					{/if}
				{/key}
			</div>

			<div class="controls">
				<md-filled-tonal-button
					class="arrows arrow-back"
					on:click={() => {
						currentimage = getpreviosimage();
					}}
					on:keyup={(e) => {
						if (e.key === 'Enter') {
							currentimage = getpreviosimage();
						}
					}}
					on:keyUp={(e) => {
						if (e.key === 'Enter') {
							currentimage = getpreviosimage();
						}
					}}
					aria-label="next image"
				>
					<span class="material-symbols-outlined"> navigate_before </span>
				</md-filled-tonal-button>

				<md-filled-tonal-button
					class="arrows arrow-forward"
					on:click={() => {
						currentimage = getnextimage();
					}}
					on:keyup={(e) => {
						if (e.key === 'Enter') {
							currentimage = getnextimage();
						}
					}}
					on:keyUp={(e) => {
						if (e.key === 'Enter') {
							currentimage = getnextimage();
						}
					}}
					aria-label="previous-image"
				>
					<span class="material-symbols-outlined"> navigate_next </span>
				</md-filled-tonal-button>
			</div>
		{/if}
	</div>
</div>

<style>
	:root {
		background: var(--md-sys-color-background);
		--md-filled-select-text-field-container-shape: 0px;
		--md-filled-select-text-field-container-color: #f7faf9;
		--md-filled-select-text-field-input-text-color: #005353;
		--md-filled-select-text-field-input-text-font: 'Noto Sans';
	}

	#container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100%;
		background: var(--md-sys-color-background);
	}

	.content {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.body {
		width: 100%;
		padding: 10px;
		display: flex;
		justify-content: center;
		height: 100%;
	}

	img {
		fill: #d2d2d2;
		max-height: calc(100vh - 200px);
		height: 100%;
		max-width: 100%;
		object-fit: contain;
	}

	.arrows {
		padding: 3px;
		width: 50%;
	}

	.controls {
		padding: 10px;
		z-index: 1;
		margin: auto;
		width: calc(100vw / 3);
		left: calc(50% - 17.5vw);
		display: flex;
		justify-content: space-evenly;
	}

	input {
		font-family: 'Noto', sans-serif;
		background: var(--md-sys-color-background);
		color: var(--md-sys-color-primary);
		width: fit-content;
		outline: var(--md-sys-color-outline);
	}
</style>
