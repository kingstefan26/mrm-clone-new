

<form action="/search/" id="search-box">
    <input type="text" name="search" id="search-input" placeholder="Search and filter" />
</form>

<style>
    form {
        font-family: helvetica neue,Helvetica,Arial,sans-serif;
    }

    #search-box {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-content: center;
        flex-wrap: wrap;
    }


    #search-input {
        cursor: text;
        border-radius: 0%;
        text-align: left;
        background-color: #fff;
        border: 1px solid #ddd;
        color: #333;
        font-size: 1.2rem;
        font-weight: 400;
        padding: 15px;
    }

    #search-input:focus-visible {
        color: #333;
        outline: 1px solid #333;
    }


    @media screen and (min-width: 1020px) {
        #search-input {
            padding: 8px;
            width: 50%;
            height: 25%;
        }

    }

    @media screen and (min-width: 500px) and (max-width: 1020px){

        #search-box > #search-input {
            max-width: 70%;
        }
    }

    @media screen and (max-width: 500px){

        #search-input {
            width: 88%;
            height: 100%;
        }


        #search-box {
            display: block;
            width: 100%;
            height: 20%;
        }
    }


</style>
