<script>
    const links = [
        {Name: "about", link: "/about/"},
        {Name: "privacy policy", link: "/privacy-policy/"},
        {Name: "terms service", link: "/"},
        {Name: "dmca notice", link: "/dmca-notice/"},
        {Name: "contact", link: "/contact/"},
        {Name: "my bookmark", link: "/"},
        {Name: "login", link: "/"}
    ]
</script>

<div class="wrapper grid-rows-[1fr,min-content] pb-10 pt-7 w-fill flex justify-center text-center text-xs">
    <div class="container grid">
        <div class="flex justify-center max-w-screen-lg flex-wrap mb-10 w-full h-full">
            {#each links as link}
                <div class="p-1.5">
                    <a data-sveltekit-preload-data
                       class="text-base font-bold macolour font-extrabold hover:text-white no-underline"
                       href={link.link}> {link.Name.toUpperCase()} </a>
                </div>
            {/each}
        </div>
        <div class="disclamers-container leading-5 mr-0.5 ml-0.5">
            <p>Some Rights Reserved © TestCorp - Test, Test, Test, Test and Test Online</p>
            <p>TestSite is completely free - paid for by advertisers, purely for information purposes only. Strictly No
                Commercial Use. Credit where credit's due.</p>
        </div>
    </div>
</div>

<style>
    .disclamers-container > p {
        color: #c5c4c4;
    }
    .wrapper {
        background-color: #2b2b2b;
        border-top: 5px solid #f15123;
    }

    .macolour {
        color: #b4b4b4;
    }
</style>