/**
 * Returns a hash code for a string.
 * (Compatible to Java's String.hashCode())
 *
 * The hash code for a string object is computed as
 *     s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * using number arithmetic, where s[i] is the i th character
 * of the given string, n is the length of the string,
 * and ^ indicates exponentiation.
 * (The hash value of the empty string is zero.)
 *
 * @param {string} s a string
 * @return {number} a hash code value for the given string.
 */
export function hashCode(s) {
	let h = 0,
		l = s.length,
		i = 0;
	if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
	return h;
}

/**
 * @param {number} h a hashcode
 * @return {string} a translated string
 */
export function transision_hashcode(h) {
	return h
		.toString()
		.replaceAll('-', '')
		.replaceAll('0', 'a')
		.replaceAll('1', 'b')
		.replaceAll('2', 'c')
		.replaceAll('3', 'd')
		.replaceAll('4', 'e')
		.replaceAll('5', 'f')
		.replaceAll('6', 'g')
		.replaceAll('7', 'h')
		.replaceAll('8', 'i')
		.replaceAll('9', 'j');
}
