<script>
    import Quicklinks from "./quicklinks.svelte";
    import SearchBox from "./SearchBox.svelte"


    const links = [
        // {Name:"BARA",link:"/genre/bara/"},
        // {Name:"MANGA",link:"/yaoi-manga/"},
        // {Name:"VIDEO",link:"/video/"},
        // {Name:"RANDOM",link:"search/?sort=sort_by_random"},
        // {Name:"POPULAR",link:"/#top-posts-2"},
        // {Name:"ASK",link:"/whats-that-book"},
        // {Name:"UPLOAD", link:"/upload"},
        {Name:"test", link:"/test"},
        {Name:"404", link:"/EXAMPLE"},
        {Name:"posts", link:"/posts"},
        {Name:"feed", link:"/altfeed"}
    ]

    const pkg = {
        links: links
    }
</script>

<div class="navbar-container">
    <div id="header-conteiner">
        <div class="titile-area">
            <div class="title-container">
                <h1 class="site-title">
                    <a href="/">MyWebsite</a>
                </h1>
            </div>
            <div class="dummy-div"></div>
            <div class="search-conteinter">
                <SearchBox></SearchBox>
            </div>

        </div>
    </div>

    <div class="quicklinks-container">
        <Quicklinks {...pkg} />
    </div>


</div>

<style>

    .quicklinks-container {
        box-shadow: 1px 1px 1px #000;
        background-color: #333;
    }

    #header-conteiner{
        /* width: 100vw; */
        display: flex;
        justify-content: center;
        background-color: #2b2b2b;
        padding: 16px;

        border-bottom: 5px solid #f15123;
    }
    .titile-area {
        margin: 0;
        display: grid;
        max-width: 1024px;
        width: 100%;
        /* grid-template-columns: 30vw 1fr; */
    }

    /* site title */
    .site-title {
        /* padding-left: 2vw; */

        justify-self: center;
        text-align: center;
        /* font-family: helvetica neue, Helvetica, Arial, sans-serif; */
        font-family: Arial, sans-serif;
        font-weight: 700;

        color: #abb1b3;
    }
    .site-title > :global(a) {

        text-decoration: none;
        color: inherit;
    }
    .site-title > :global(a):hover {
        text-decoration: none;
        transition: color 1s; /* For modern browsers */
    }

    /* pc */

    @media screen and (min-width: 1020px) {
        .titile-area {
            grid-template-columns: repeat(3, 3fr);
        }

        .site-title {
            column-span: 2;
        }

        .site-title {
            padding-top: 1em;
        }
    }

    /* laptop */

    /* tablet */

    @media screen and (min-width: 500px) and (max-width: 1020px){
        .search-conteinter {
            justify-content: flex-end;
        }
    }

    /* phone */

    @media screen and (max-width: 500px) {
        .search-conteinter {
            justify-content: center;
        }
        .titile-area {
            grid-template-rows: 50px 1fr;
            margin: 20px;
        }
        #header-conteiner {
            padding: 0;
        }
    }

</style>
