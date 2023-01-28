<script>
    import Popup from "$lib/components/popup/Popup.svelte";
    export let user

    let showPopup = false;

    function saveUser() {
        console.log(user)
    }
</script>


<div class="flex font-serif">
    <p class="flex-auto p-3">
        {user.username}
        {user.email}
    </p>
    <Popup expanded={showPopup}>
        <button slot="alwaysVisible" on:click={() => {showPopup = !showPopup}}>
            Edit user
        </button>

        <div slot="content">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" bind:value={user.username}>

            <label for="email">Email</label>
            <input type="email" name="email" id="email" bind:value={user.email}>
            <button on:click={saveUser} type="submit">Save</button>
        </div>
    </Popup>

</div>