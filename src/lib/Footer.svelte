<script>
    import Quicklinks from "./header/quicklinks_stupidcopy.svelte";

    const links = [
        {Name:"about",link:"/about/"},
        {Name:"privacy policy",link:"/privacy-policy/"},
        {Name:"terms service",link:"/terms-service/"},
        {Name:"dmca notice",link:"/dmca-notice/"},
        {Name:"contact",link:"/contact/"},
        {Name:"my bookmark",link:"/bookmarks"},
        {Name:"login",link:"/login"}
    ]

    const pkg = {
        links: links
    }
</script>

<div class="wrapper">
    <div class="container">
        <div class="links-container">

            <Quicklinks {...pkg} />

        </div>
        <div class="disclamers-container">
            <p>Some Rights Reserved © TestCorp - Test, Test, Test, Test and Test Online</p>
            <p>TestSite is completely free - paid for by advertisers, purely for information purposes only. Strictly No Commercial Use. Credit where credit's due.</p>
        </div>


    </div>
</div>


<style>
    .wrapper {

        padding-top: 40px;
        padding-bottom: 40px;

        width: 100%;

        display: flex;
        justify-content: center;

        background-color: #2b2b2b;
        border-top: 5px solid #f15123;
        font-size: 14px;
        line-height: 2;
        text-align: center;
    }


    .container {
        display: grid;
        grid-template-rows: 1fr min-content;
    }

    .disclamers-container > p{
        margin: 0 2% 0 2% ;
        color: #c5c4c4;
    }

    .wrapper :global(h1)  {
        width: 40%;
        text-align: center;
    }
</style>