<form action="/search/" class="flex justify-center">
    <input class="font-light p-2 text-left rounded-none max-[500px]:w-full min-[500px]:w-1/2 " type="text" name="search" id="search-input" placeholder="Search and filter" />
</form>

<style>
    form {
        font-family: helvetica neue,Helvetica,Arial,sans-serif;
    }

    #search-input {
        cursor: text;
        background-color: #fff;
        border: 1px solid #ddd;
        color: #333;
        font-size: 1.2rem;
    }

    #search-input:focus-visible {
        color: #333;
        outline: 1px solid #333;
    }
</style>
