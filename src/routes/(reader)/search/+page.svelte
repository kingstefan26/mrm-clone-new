<script>
	import PostWiget from '../[[page=integer]]/PostWiget.svelte';
	import { invalidate } from '$app/navigation';
	import PostWigetSkeleton from '../[[page=integer]]/PostWigetSkeleton.svelte';
	import { page } from '$app/stores';

	export let data;

	// let options = {
	// 	filter: {},
	// 	negfilter: {}
	// };

	// function updateOption(value = '', category = '', negfilter = false) {
	// 	if (options.filter[category] === undefined || options.negfilter[category] === undefined) {
	// 		options.filter = {};
	// 		options.negfilter = {};
	// 		for (const [category] of Object.entries(data.types)) {
	// 			options.filter[category] = [];
	// 			options.negfilter[category] = [];
	// 		}
	// 	}
	//
	// 	if (negfilter) {
	// 		if (options.negfilter[category].includes(value)) {
	// 			options.negfilter[category] = options.negfilter[category].filter((x) => x !== value);
	// 		} else {
	// 			options.negfilter[category].push(value);
	// 		}
	// 	} else {
	// 		if (options.filter[category].includes(value)) {
	// 			options.filter[category] = options.filter[category].filter((x) => x !== value);
	// 		} else {
	// 			options.filter[category].push(value);
	// 		}
	// 	}
	//
	// 	options = options;
	// 	console.log('Options:', options);
	// 	// do you guys own a thing called 'zaza'??
	// 	invalidate('/api/search/full');
	// }

	let sortMode = 'newest';
	function refresh() {
		$page.url.searchParams.set('sort', sortMode);
		invalidate('/api/search/full');
	}
</script>

<div class="max-w-full">
	<h1 class="font-publicsans text-white text-3xl font-bold text-center">Search</h1>
	<!--	<h2 class="font-publicsans text-gray-400 text-medium italic text-center">-->
	<!--		(The second checkbox is used for excluding)-->
	<!--	</h2>-->

	<!--	<div>-->
	<!--		{#each Object.entries(data.types) as [category, values]}-->
	<!--			<div>-->
	<!--				{#if values.length > 0}-->
	<!--					<div>-->
	<!--						<p class="" style="color: rgb(197, 196, 196)">By {category}</p>-->
	<!--						{#each values as value}-->
	<!--							<label class="text-stone-300">{value}</label>-->
	<!--							<input-->
	<!--								type="checkbox"-->
	<!--								name={category}-->
	<!--								{value}-->
	<!--								checked={options[category] !== undefined &&-->
	<!--									options.filter[category].includes(value)}-->
	<!--								disabled={options.negfilter[category] !== undefined &&-->
	<!--									options.negfilter[category].includes(value)}-->
	<!--								on:click={updateOption(value, category, false)}-->
	<!--							/>-->
	<!--							<input-->
	<!--								style="background: red"-->
	<!--								type="checkbox"-->
	<!--								name={category}-->
	<!--								{value}-->
	<!--								checked={options.negfilter[category] !== undefined &&-->
	<!--									options.negfilter[category].includes(value)}-->
	<!--								disabled={options.filter[category] !== undefined &&-->
	<!--									options.filter[category].includes(value)}-->
	<!--								on:click={updateOption(values, category, true)}-->
	<!--							/>-->
	<!--						{/each}-->
	<!--					</div>-->
	<!--				{/if}-->
	<!--			</div>-->
	<!--		{/each}-->
	<!--	</div>-->

	<div>
		<span class="text-stone-300">Order by:</span>
		<select bind:value={sortMode} on:change={refresh}>
			<option value="newest">Newest</option>
			<option value="oldest">Oldest</option>
			<option value="relevant">Relevancy</option>
			<option value="random">Random</option>
		</select>
	</div>

	<div>
		{#key location.search}
			{#await data.stream.hits}
				<p class="text-gray-400 italic">loading...</p>
				<div class="flex flex-wrap justify-center">
					<PostWigetSkeleton />
					<PostWigetSkeleton />
					<PostWigetSkeleton />
				</div>
			{:then hits}
				<p class="text-gray-400 italic">got {hits.length} hits</p>
				<div class="flex flex-wrap justify-center">
					{#each hits as hit}
						<PostWiget post={hit.contents} />
					{/each}
				</div>
			{/await}
		{/key}
	</div>
</div>
