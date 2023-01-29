<script>
    import Quicklinks from "$lib/components/layout/header/QuickLinks.svelte";
    import SearchBox from "$lib/components/layout/header/SearchBox.svelte"


    const links = [
        {Name:"BARA",link:"/"},
        {Name:"MANGA",link:"/"},
        {Name:"VIDEO",link:"/"},
        {Name:"RANDOM",link:"/"},
        {Name:"POPULAR",link:"/"},
        {Name:"ASK",link:"/"},
        {Name:"UPLOAD", link:"/"},
        // {Name: "feed", link: "/altfeed"}
    ]

</script>

<div class="flex justify-center p-4" style="background-color: #2b2b2b; border-bottom: 5px solid #f15123;">
    <div class="m-0 grid max-w-screen-lg w-full joemama">
        <a href="/">
            <h1 class="site-title font-bold justify-self-center text-center text-3xl">
                MyWebsite
            </h1>
        </a>
        <div class="justify-self-center w-full">
            <SearchBox/>
        </div>
    </div>
</div>

<div style="box-shadow: 1px 1px 1px #000; background-color: #333;">
    <Quicklinks {links}/>
</div>


<style>
    .site-title {
        font-family: helvetica neue, Helvetica, Arial, sans-serif;
        margin: 0 0 0.5em 0;
        line-height: 1.2;
        color: #abb1b3;
    }

    .joemama {
        grid-template-rows: 1fr 1fr;
    }

    @media (min-width: 1024px) {
        .joemama {
            grid-template-rows: none;
            grid-template-columns: 1fr 1fr;
        }
    }

</style>
