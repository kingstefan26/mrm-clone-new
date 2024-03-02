<script>
	import Popup from '$lib/components/popup/Popup.svelte';

	import '@material/web/textfield/outlined-text-field.js';
	import '@material/web/textfield/filled-text-field.js';
	import '@material/web/button/filled-button.js';

	/** @typedef {{ id: number, username: string, email: string, role: string }} UserObject */
	/** @type {UserObject} */
	export let user;

	let showPopup = false;

	/** @type {HTMLInputElement} */
	let usernameField;

	/** @type {HTMLInputElement} */
	let emailField;

	function saveUser() {
		user.username = usernameField.value;
		console.log(user);
	}
</script>

<Popup expanded={showPopup}>
	<div slot="alwaysVisible">
		<md-filled-button
			on:click={() => {
				// when the expanded variable changes inside the component
				// (by eg a button click),
				// that change is not reflected outside, so showPopup stays true,
				// we need to manually set it to false, triggering an update
				if (showPopup === true) {
					showPopup = false;
				}
				showPopup = !showPopup;
			}}
		>
			Edit user
		</md-filled-button>
	</div>

	<div slot="content">
		<div
			on:keyup={(e) => {
				if (e.key === 'Escape') {
					showPopup = false;
				}
				if (e.key === 'Enter') {
					saveUser();
					showPopup = false;
				}
			}}
		>
			<md-outlined-text-field value={user.username} label="Username" bind:this={usernameField} />

			<md-outlined-text-field value={user.email} label="email" bind:this={emailField} />
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<md-filled-button on:click={saveUser}>Save</md-filled-button>
		</div>
	</div>
</Popup>
