/**
 * @param endpoint {string}
 * @param data {any}
 * @return {Promise<Response>}
 */
export default async function postJson(endpoint, data) {
	return await fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
}
