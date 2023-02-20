/** @type {import('./$types').Load} */
export async function load({ url, fetch }) {
	let hits = (await fetch(`/api/search/full${url.search}`).then((res) => res.json())).data;
	return {
		hits
	};
}
