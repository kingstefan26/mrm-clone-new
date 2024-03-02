import { paginate, User } from '$lib/api/server/db.js';
import { getHash } from '$lib/sha.js';

/** @type {import("./$types").PageServerLoad}
 * @returns {{ users: UserObject[], page: number, totalPages: number }}
 */
export async function load({ params }) {
	const pageSize = 20;

	/** @type {number} */
	const page = params.page || 0;

	const users = await User.findAndCountAll(paginate({ where: {} }, { page: page, pageSize }));

	/** @typedef {{ id: number, username: string, email: string, role: string }} UserObject */
	/** daddy sequelize outputs crusty classes, so I have to map them, cuz {plain: true} doesn't work???
	 *  @type {UserObject[]} */
	const userObjects = users.rows.map((user) => {
		return {
			id: user.id,
			username: user.username,
			email: user.email,
			role: user.role
		};
	});

	return {
		users: userObjects,
		page: page,
		totalPages: Math.ceil(users.count / pageSize)
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	createUserFromAction: async ({ request }) => {
		const formData = await request.formData();
		const user = {
			username: formData.get('username'),
			email: formData.get('email'),
			password: formData.get('password'),
			admin: formData.get('admin') === 'on'
		};

		// check all fields
		if (!user.username || !user.email || !user.password) {
			return { success: true, body: 'missing fields' };
		}

		// check for valid user ^[a-zA-Z0-9_]{(2, 16)}$
		if (!user.username.match(/^[a-zA-Z0-9_]{2,16}$/)) {
			return { success: true, body: 'invalid username' };
		}

		// check for valid email
		if (!user.email.match(/.+@.+\..+/)) {
			return { success: true, body: 'invalid email' };
		}

		// check for valid password
		if (!user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
			return { success: true, body: 'invalid password' };
		}

		// check for unique email
		if (await User.findOne({ where: { email: user.email } })) {
			return { success: true, body: 'email already exists' };
		}

		// check for unique username
		if (await User.findOne({ where: { username: user.username } })) {
			return { success: true, body: 'username already exists' };
		}

		// pick random salt
		let salt = Array.from(crypto.getRandomValues(new Uint8Array(2)))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');

		const passHash = await getHash(user.password + salt);
		const obj = {
			username: user.username,
			email: user.email,
			passHash: passHash,
			role: user.admin,
			salt: salt
		};
		console.log('creating user', obj);

		return { success: true, body: 'ok' };
	}
};
