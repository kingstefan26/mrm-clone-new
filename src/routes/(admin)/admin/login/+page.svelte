<script>
    import {enhance} from '$app/forms';

    /** @type {import('./$types').ActionData} */
    export let form;
</script>

<svelte:head>
    <title>Sing in • MyWebsite</title>
</svelte:head>


<div class="container mt-10 border-2 p-6 max-w-sm mx-auto lg space-x-3 shadow font-serif space-x-3">
    <h1 class="bold text-white text-4xl">
        Sign In
    </h1>

    <form use:enhance method="POST" class="mt-2">
        <fieldset>
            <input
                    class="border border-gray-300 m-1"
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                    autocomplete="email webauthn"
            />
            <input
                    class="border border-gray-300 m-1"
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    autocomplete="password"
            />
        </fieldset>
        <button class="text-black mr-7 border-gray-400 border text-black-200 p-1 mx-0.5" type="submit">
            Sign in
        </button>
    </form>
    <p>
        <a href="/admin/register" class="underline text-black">
            Need an account?
        </a>
    </p>


</div>


<!--<style>-->

<!--    .pressdown_effect:hover {-->
<!--        transform: translateY(-3px);-->
<!--        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);-->
<!--    }-->

<!--    .pressdown_effect:active {-->
<!--        transform: translateY(1px);-->
<!--        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);-->
<!--    }-->

<!--    .rainbow_pulse {-->
<!--        background: linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);-->

<!--        animation: rainbow 19s ease infinite;-->
<!--        background-size: 1000% 1000%;-->
<!--    }-->

<!--    @keyframes rainbow {-->
<!--        0%{background-position:0 82%}-->
<!--        50%{background-position:100% 19%}-->
<!--        100%{background-position:0 82%}-->
<!--    }-->
<!--</style>-->