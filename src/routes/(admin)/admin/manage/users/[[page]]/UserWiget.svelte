<script>
	import '@material/web/textfield/outlined-text-field.js';
	import '@material/web/iconbutton/icon-button.js';
	import '@material/web/textfield/filled-text-field.js';
	import '@material/web/button/filled-button.js';
	import '@material/web/dialog/dialog.js';

	/** @typedef {{ id: number, username: string, email: string, role: string }} UserObject */
	/** @type {UserObject} */
	export let user;

	/** @type {HTMLInputElement} */
	let usernameField;

	/** @type {HTMLInputElement} */
	let emailField;

	let dialog;

	function saveUser() {
		user.username = usernameField.value;
		console.log(user);
	}
</script>

<md-icon-button
	on:click={() => {
		dialog.show();
	}}
>
	<span class="material-symbols-outlined"> edit </span>
</md-icon-button>
<md-dialog bind:this={dialog}>
	<div slot="headline">
		<span class="material-symbols-outlined"> person_edit </span>
		Edit {user.username}
	</div>
	<div slot="content">
		<md-outlined-text-field value={user.username} label="Username" bind:this={usernameField} />
		{#if user.email}
			<md-outlined-text-field value={user.email} label="email" bind:this={emailField} />
		{/if}
	</div>
	<div slot="actions">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<md-filled-button on:click={saveUser}>Save</md-filled-button>
	</div>
</md-dialog>
