<script>
	import { goto } from '$app/navigation';

	const cacheMap = new Map();
	let quickSearchResults = [];

	let nextRefresh = undefined;

	function quickSearch() {
		if (searchBoxVal.length === 0) {
			quickSearchResults = [];
			return;
		}
		if (searchBoxVal.length < 2) return;
		if (cacheMap.has(searchBoxVal)) {
			quickSearchResults = cacheMap.get(searchBoxVal);
		} else {
			// throttle this so it happens at most, every 500ms
			if (nextRefresh !== undefined) {
				clearTimeout(nextRefresh);
			}

			nextRefresh = setTimeout(() => {
				nextRefresh = undefined;
				fetch(`/api/search/quick?query=${searchBoxVal}&limit=5`)
					.then((response) => response.json())
					.then((json) => {
						console.log(json);
						const { data } = json;
						cacheMap.set(searchBoxVal, data);
						quickSearchResults = data;
					})
					.catch((err) => {
						alert('Error searching');
						console.error(err);
					});
			}, 100);
		}
	}

	let isFocused = false;

	const onFocus = () => (isFocused = true);
	const onBlur = () => (isFocused = false);

	function newSearchInput({ link }) {
		searchBoxVal = '';
		quickSearchResults = [];
		goto(link);
	}

	let searchBoxVal = '';

	function searchGo() {
		const qury = new URLSearchParams();
		qury.set('query', searchBoxVal);
		goto(`/search?${qury.toString()}`);
	}
</script>

<div class="flex justify-center w-full h-full">
	<form
		class="max-[500px]:w-full min-[500px]:w-1/2"
		on:submit|preventDefault={searchGo}
		autocomplete="off"
	>
		<input
			bind:value={searchBoxVal}
			on:keydown={quickSearch}
			id="searchfield"
			type="text"
			name="searchfield"
			placeholder="Search"
			on:focus={onFocus}
			on:blur={onBlur}
		/>

		<div class="relative">
			{#if isFocused === true}
				<ul class="z-10">
					{#each quickSearchResults as oneResult}
						<li on:mousedown={() => newSearchInput(oneResult)}>
							{#if oneResult.type === 'post'}
								<div class="resultcontainer">
									{oneResult.contents.title}
									<img
										alt="Poster for post"
										width="52"
										height="71"
										decoding="auto"
										loading="lazy"
										class="post-poster pusle_anim"
										src="/api/asset/proxy/{oneResult.contents.posterAssetId}"
									/>
								</div>
							{:else}
								<div class="resultcontainer">
									<p>
										<a alt={oneResult.type} href={oneResult.link}>{oneResult.contents}</a>
										<span class="text-gray-500 font-bold ml-1">{oneResult.type}</span>
									</p>
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</form>
</div>

<style>
	input {
		text-align: center;
		display: block;
		transition: all 0.2s ease-out;
		margin: auto;
		position: relative;

		border-radius: 0.2rem;
		width: 75%;
		height: 75%;
		background: var(--md-sys-color-background);
		outline: var(--md-sys-color-outline) 1px solid;
		caret-color: var(--md-sys-color-primary);
		color: var(--md-sys-color-secondary);
	}

	input::placeholder {
		color: var(--md-sys-color-tertiary);
	}

	input:hover {
		box-shadow: 0 0 10px var(--md-sys-color-secondary);

		width: 100%;
		height: 85%;
		/*box-shadow: rgba(0, 0, 0, 0.16) 0 4px 8px, rgba(0, 0, 0, 0.23) 0 4px 8px;*/
	}

	.pusle_anim {
		animation: loading-animation 2s ease-in-out infinite;
		background-color: #343434;
		background-repeat: no-repeat;
		background-image: linear-gradient(90deg, #343434, #505050, #343434);
	}

	@keyframes loading-animation {
		0% {
			background-position: -1000px 0;
		}
		100% {
			background-position: calc(1000px + 100%) 0;
		}
	}

	.post-poster {
		object-fit: contain;
	}

	.resultcontainer {
		max-height: 4em;
		display: grid;
		grid-template-columns: 1fr auto;
	}

	ul {
		width: 100%;
		top: 100%;
		left: 0;
		position: absolute;
		margin: 0;
	}

	li {
		width: 100%;

		list-style: none;

		padding: 10px;
		cursor: pointer;
		background-color: #fff;
	}

	li:hover {
		background-color: lightgray;
	}
</style>
