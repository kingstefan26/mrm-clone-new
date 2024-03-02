<script>
	import { enhance } from '$app/forms';
	import UserWiget from './UserWiget.svelte';
	import '@material/web/fab/fab.js';
	import '@material/web/icon/icon.js';
	import '@material/web/list/list.js';
	import '@material/web/list/list-item.js';
	import '@material/web/button/text-button.js';
	import '@material/web/dialog/dialog.js';
	import '@material/web/divider/divider.js';
	import '@material/web/checkbox/checkbox.js';
	import '@material/web/button/filled-button.js';
	import '@material/web/progress/linear-progress.js';

	/** @type {import("./$types").PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	let newUserDialog;
	let loadingNewUserSpinner = false;

	const newUserFormSpinner = () => {
		loadingNewUserSpinner = true;
		return async ({ result, update }) => {
			loadingNewUserSpinner = false;
			await update(result);
		};
	};
</script>

<div class="grid-cols-[1fr,auto]">
	<md-list>
		{#each data.users as user}
			<md-list-item interactive>
				<div slot="start" class="text-2xl font-extrabold">
					{user.username}
				</div>
				<div slot="supporting-text" class="text-sm font-medium">
					{user.email}
				</div>
				<div slot="end">
					<UserWiget {user} />
				</div>
			</md-list-item>
		{/each}
	</md-list>

	<div class="flex justify-center">
		<h2 class="text-white">Pages:</h2>
		<div>
			{#each Array(data.totalPages) as _, i}
				<a class="underline" href="/admin/manage/users/{i}">{i}</a>
			{/each}
		</div>
	</div>
</div>
<md-dialog bind:this={newUserDialog}>
	<div slot="headline">
		<span class="material-symbols-outlined"> person_add </span>
		Create a User
	</div>
	<form
		use:enhance={newUserFormSpinner}
		slot="content"
		method="POST"
		action="?/createUserFromAction"
		class="grid gap-2"
	>
		<md-outlined-text-field
			required
			pattern="^[a-zA-Z0-9_]{'{'}(2, 16){'}'}$"
			name="username"
			label="Username"
			supporting-text="2-16 characters, letters, numbers, and underscores"
		/>
		<md-outlined-text-field required type="email" name="email" label="Email" />
		<md-outlined-text-field
			required
			name="password"
			pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{'{'}8,{'}'}$"
			label="Password"
			supporting-text="8 characters, at least one uppercase letter, one lowercase letter, and one number"
		/>
		<label for="admin">
			Admin
			<md-checkbox name="admin" id="admin" />
		</label>
		<md-filled-button trailing-icon type="summit">
			Create
			<span slot="icon" class="material-symbols-outlined"> add </span>
		</md-filled-button>

		{#if loadingNewUserSpinner}
			<md-linear-progress indeterminate />
		{/if}
		{#if form?.success}
			<md-divider />
			<!-- show the response message -->
			<div class="text-center">{form.body}</div>
		{/if}
	</form>
</md-dialog>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<md-fab
	class="fixed bottom-10 right-12"
	on:click={() => {
		newUserDialog.show();
	}}
>
	<span slot="icon" class="material-symbols-outlined"> add </span>
</md-fab>

<style>
	* {
		--md-dialog-container-color: var(--md-sys-color-secondary-container);
	}
</style>
