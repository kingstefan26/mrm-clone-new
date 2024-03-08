<script>
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	onMount(async () => {
		// Availability of `window.PublicKeyCredential` means WebAuthn is usable.
		if (window.PublicKeyCredential && PublicKeyCredential.isConditionalMediationAvailable) {
			// Check if conditional mediation is available.
			const isCMA = await PublicKeyCredential.isConditionalMediationAvailable();
			if (isCMA) {
				// To abort a WebAuthn call, instantiate an `AbortController`.
				const abortController = new AbortController();

				const publicKeyCredentialRequestOptions = {
					// Server generated challenge
					challenge: 'KAWAII',
					// The same RP ID as used during registration
					rpId: 'example.com'
				};

				const credential = await navigator.credentials.get({
					publicKey: publicKeyCredentialRequestOptions,
					signal: abortController.signal,
					// Specify 'conditional' to activate conditional UI
					mediation: 'conditional'
				});
			}
		}
	});
</script>

<svelte:head>
	<title>Sing in • MyWebsite</title>
</svelte:head>

<div class="">
	<h1 class="">Sign In</h1>

	<form use:enhance method="POST" action="?/login" class="" autocomplete="on">
		<input name="email" type="email" required placeholder="Email" autocomplete="email webauthn" />
		<input
			name="password"
			type="password"
			autocomplete="current-password"
			required
			placeholder="Password"
		/>
		<button type="submit"> Sign in </button>
	</form>
	<p>
		<a href="/admin/register" class="underline text-black"> Need an account? </a>
	</p>
</div>
