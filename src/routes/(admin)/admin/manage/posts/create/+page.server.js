import { fail, redirect } from '@sveltejs/kit';
import { Post } from '$lib/api/server/db.js';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		const title = formData.get('title');

		// replace non ascii characters
		// eslint-disable-next-line no-control-regex
		let id = title.replace(/[^\x00-\x7F]/g, '');
		// to lowercase
		id = title.toLowerCase();
		// replace spaces with underscore
		id = title.replace(/\s+/g, '_');

		if (id === '') {
			return fail(400, "Title can't be empty");
		}

		// check if with the given id already exists
		let exisitngPost = await Post.findOne({
			where: {
				id: id
			}
		});
		// if it does, add a random number to the end
		if (exisitngPost) {
			id += Math.floor(Math.random() * 1000);
		}

		console.log(`creating post ${id} with title ${title}`);

		const newPost = await Post.create({
			id: id,
			title: title,
			published: false
		});

		redirect(307, '/admin/manage/posts/edit/' + newPost.id);
	}
};
