import { getPostlessIndex } from '$lib/api/server/SearchIndex.js';
import { json } from '@sveltejs/kit';

export async function GET() {
	return json(getPostlessIndex());
}
