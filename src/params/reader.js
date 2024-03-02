/** @type {import("@sveltejs/kit").ParamMatcher} */
export function match(param) {
	return /reader/gi.test(param);
}
