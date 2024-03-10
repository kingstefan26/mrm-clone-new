<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import '@material/web/textfield/outlined-text-field';
	import '@material/web/button/filled-button';
	import '@material/web/button/text-button';
	import '@material/web/progress/linear-progress.js';
	import { goto } from '$app/navigation';
	import {
		base64URLStringToBuffer,
		browserSupportsWebAuthn,
		browserSupportsWebAuthnAutofill,
		bufferToBase64URLString,
		startAuthentication,
		WebAuthnAbortService
	} from '@simplewebauthn/browser';
	import postJson from '$lib/util.js';

	/** @type {import('./$types').PageData} */
	export let data;

	// copy pasted cuz the lib is dumb asf
	function bufferToUTF8String(value) {
		return new TextDecoder('utf-8').decode(value);
	}
	const attachments = ['cross-platform', 'platform'];
	function toAuthenticatorAttachment(attachment) {
		if (!attachment) {
			return;
		}
		if (attachments.indexOf(attachment) < 0) {
			return;
		}
		return attachment;
	}

	onMount(async () => {
		if (await browserSupportsWebAuthnAutofill()) {
			console.log('conditionalUiOptions ', data.conditionalUiOptions);

			if (!browserSupportsWebAuthn()) {
				console.log('WebAuthn is not supported in this browser');
				return;
			}

			let credential = await navigator.credentials.get({
				mediation: 'conditional',
				publicKey: {
					...data.conditionalUiOptions,
					challenge: base64URLStringToBuffer(data.conditionalUiOptions.challenge),
					allowCredentials: []
				},
				signal: WebAuthnAbortService.createNewAbortSignal()
			});

			if (!credential) {
				console.log('WebAuthn authentication was not completed');
				return;
			}

			const { id, rawId, response, type } = credential;
			const assertionResponse = {
				id: id,
				rawId: bufferToBase64URLString(rawId),
				response: {
					authenticatorData: bufferToBase64URLString(response.authenticatorData),
					clientDataJSON: bufferToBase64URLString(response.clientDataJSON),
					signature: bufferToBase64URLString(response.signature),
					userHandle: response.userHandle ? bufferToUTF8String(response.userHandle) : undefined
				},
				type: type,
				clientExtensionResults: credential.getClientExtensionResults(),
				authenticatorAttachment: toAuthenticatorAttachment(credential.authenticatorAttachment)
			};

			const verificationResponse = await postJson(
				'/admin/passkeys/login/finish',
				assertionResponse
			);

			if (verificationResponse.ok) {
				message = 'Login successful';
				await goto('/admin');
			} else {
				message = 'Login Failed';
			}
		}
	});

	async function initPasskey() {
		loadingNewUserSpinner = true;
		message = '';
		const resp = await postJson('/admin/passkeys/login/start', { username: email });
		if (!resp.ok) {
			message = 'failed loading login options from server';
			loadingNewUserSpinner = false;
			return;
		}
		const options = await resp.json();
		console.log(options);
		const assertionResponse = await startAuthentication(options);

		const verificationResponse = await postJson('/admin/passkeys/login/finish', assertionResponse);
		if (verificationResponse.ok) {
			message = 'Login successful';
			await goto('/admin');
		} else {
			message = 'Login Failed';
			loadingNewUserSpinner = false;
		}
	}

	let loadingNewUserSpinner = false;
	let passkeyAvailable = false;
	let email;
	let message = '';

	async function checkUsername(event) {
		loadingNewUserSpinner = true;
		message = '';
		const data = new FormData(event.target);
		email = data.get('username');

		const res = await postJson('/admin/passkeys/init', { username: email });
		const body = await res.json();
		console.log(body);

		if (!res.ok) {
			message = body.message;
		} else {
			passkeyAvailable = body.hasPasskeys;

			if (passkeyAvailable) {
				page = 1;
				initPasskey();
			} else {
				page = 2;
			}
		}

		loadingNewUserSpinner = false;
	}

	async function loginUsingPassword(event) {
		loadingNewUserSpinner = true;
		message = '';
		let password = new FormData(event.target).get('password');

		const res = await postJson('/admin/login/password', {
			email: email,
			password: password
		});

		if (!res.ok) {
			message = (await res.json()).message;
		}
		loadingNewUserSpinner = false;
		await goto('/admin');
	}

	let page = 0;
</script>

<svelte:head>
	<title>Sign in</title>
</svelte:head>

<div class="flex justify-center items-center">
	<div class="m-10">
		<div
			class="text-[var(--md-sys-color-on-secondary-container)] bg-[var(--md-sys-color-secondary-container)] w-[40vw] min-w-fit rounded-md p-4 py-10 max-h-[26em] multipageContainer"
		>
			{#if page === 0}
				<form
					class="grid gap-1 h-full multipagePage"
					autocomplete="on"
					on:submit|preventDefault={checkUsername}
					in:fly={{ x: 10, duration: 200 }}
				>
					<h1 class="text-4xl font-bold text-center mb-6">Login</h1>
					<div class="flex justify-center items-center flex-wrap gap-2 my-4 flex-col">
						<md-outlined-text-field
							required
							name="username"
							label="Email or Username"
							autocomplete="username webauthn"
						/>
					</div>

					<div class="flex justify-between px-6 pb-4">
						<md-text-button href="/admin/register"> Register </md-text-button>
						<md-filled-button type="submit" class=""> Log in </md-filled-button>
					</div>
					{#if loadingNewUserSpinner}
						<md-linear-progress indeterminate />
					{/if}
					{#if message != ''}
						<div class="text-center text-[var(--md-sys-color-error)]">{message}</div>
					{/if}
				</form>
			{/if}
			{#if page === 1}
				<div class="grid gap-1 h-full multipagePage" in:fly={{ x: 10, duration: 200 }}>
					<h1 class="text-4xl font-bold text-center mb-6">Use a Passkey</h1>

					<div class="flex justify-between px-6 pb-4">
						<md-filled-button
							on:click={() => {
								page = 0;
							}}
						>
							back
						</md-filled-button>
						<md-text-button
							on:click={() => {
								page = 2;
							}}
						>
							use a password instead
						</md-text-button>
					</div>
					{#if loadingNewUserSpinner}
						<md-linear-progress indeterminate />
					{/if}
					{#if message !== ''}
						<div class="text-center text-[var(--md-sys-color-error)]">{message}</div>
					{/if}
				</div>
			{/if}

			{#if page === 2}
				<form
					class="grid gap-1 h-full multipagePage"
					on:submit|preventDefault={loginUsingPassword}
					in:fly={{ x: 10, duration: 200 }}
				>
					<h1 class="text-4xl font-bold text-center mb-6">Enter Your password</h1>
					<div class="flex justify-center items-center flex-wrap gap-2 my-4 flex-col">
						<md-outlined-text-field
							required
							type="password"
							name="password"
							label="Password"
							autocomplete="password"
						/>
					</div>

					<div class="flex justify-between px-6 pb-4">
						<md-text-button
							on:click={() => {
								page = 0;
							}}
						>
							back
						</md-text-button>
						<md-filled-button type="submit" class=""> Log in </md-filled-button>
					</div>
					{#if loadingNewUserSpinner}
						<md-linear-progress indeterminate />
					{/if}
					{#if message !== ''}
						<div class="text-center text-[var(--md-sys-color-error)]">{message}</div>
					{/if}
				</form>
			{/if}
		</div>

		<div class="flex justify-end mt-1 gap-2">
			<md-text-button href=""> Terms </md-text-button>
			<md-text-button href=""> Privacy Policy </md-text-button>
			<md-text-button href=""> Help </md-text-button>
		</div>
	</div>
</div>

<style>
	.multipageContainer {
		display: grid;
		align-items: start;
	}

	.multipagePage {
		grid-area: 1/1/2/2;
	}
</style>
