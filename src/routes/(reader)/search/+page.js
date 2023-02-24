/** @type {import("./$types").Load} */
export async function load({ url, fetch }) {
	return {
		types: await fetch(`/api/search/index`).then((res) => res.json()),
		stream: {
			hits: fetch(`/api/search/full${url.search.toString()}`)
				.then((res) => res.json())
				.then(async (r) => {
					await new Promise((r) => setTimeout(r, 1000));
					return r.data;
				})
		}
	};
}
