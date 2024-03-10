<script>
	import '@material/web/textfield/outlined-text-field';
	import '@material/web/button/filled-button';
	import '@material/web/button/text-button';
	import '@material/web/progress/linear-progress';
	import { browserSupportsWebAuthn, startRegistration } from '@simplewebauthn/browser';
	import { goto } from '$app/navigation';
	import postJson from '$lib/util.js';
	import { onMount } from 'svelte';

	let usernameField;

	let loading;
	let response;
	let passkeyDisabled = true;

	onMount(() => {
		passkeyDisabled = !browserSupportsWebAuthn();
	});

	async function handleForm() {
		loading = true;

		const res = await postJson('/admin/passkeys/registration/start', {
			username: usernameField.value
		});

		if (!res.ok) {
			response = 'User already exists or failed to get registration options from server';
		}

		const opt = await res.json();

		console.log(opt);

		const attestationResponse = await startRegistration(opt);
		if (!attestationResponse) {
			loading = false;
			response = 'Failed to create a passkey';
		}
		const verificationResponse = await postJson(
			'/admin/passkeys/registration/finish',
			attestationResponse
		);

		loading = false;

		console.log(verificationResponse);

		if (verificationResponse.ok) {
			response = 'Success, redirecting to home page...';
			setTimeout(() => {
				goto('/admin');
			}, 2000);
		} else {
			response = 'Registration failed';
		}
	}
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<div class="flex justify-center items-center">
	<div class="m-10">
		<div
			class="text-[var(--md-sys-color-on-secondary-container)] bg-[var(--md-sys-color-secondary-container)] w-[40vw] min-w-fit rounded-md p-4 py-10 max-h-[26em]"
		>
			<form on:submit|preventDefault={handleForm} class="grid gap-1 h-full" autocomplete="on">
				<h1 class="text-4xl font-bold text-center mb-6">Register</h1>
				<div class="flex justify-center items-center flex-wrap gap-2 my-4 flex-col">
					<md-outlined-text-field
						bind:this={usernameField}
						required
						type="username"
						name="username"
						label="Username"
					/>
				</div>

				<div class="flex justify-between px-6 pb-4">
					<md-text-button href="/admin/login"> Login </md-text-button>
					<md-filled-button type="submit" disabled={passkeyDisabled}>
						Create Passkey
					</md-filled-button>
				</div>
				{#if loading}
					<md-linear-progress indeterminate />
				{/if}
				{#if response}
					<div class="text-center">{response}</div>
				{/if}
			</form>
		</div>
		<div class="flex justify-end mt-1 gap-2">
			<md-text-button href=""> Terms </md-text-button>
			<md-text-button href=""> Privacy Policy </md-text-button>
			<md-text-button href=""> Help </md-text-button>
		</div>
	</div>
</div>
