<style>
    .pusle_anim {
        animation: loading-animation 1.2s ease-in-out infinite;
        background-color: rgb(96, 96, 96);
        background-repeat: no-repeat;
        background-image: linear-gradient(
                90deg,
                rgb(96, 96, 96),
                rgb(155, 155, 155),
                rgb(96, 96, 96)
        );
    }

    @keyframes loading-animation {
        0% {
            background-position: -200px 0;
        }
        100% {
            background-position: calc(200px + 100%) 0;
        }
    }
</style>

<article class="wrapper">
    <div class="pusle_anim"
         style="width: 140px; height: 30px; margin-bottom: 7px; margin-right: auto; margin-left: auto"></div>
    <div class="pusle_anim"
         style="width: 165px; height: 20px; margin-bottom: 5px; margin-right: auto; margin-left: auto"></div>

    <div class="pusle_anim" style="height: 260px; width: 180px; "></div>
    <div class="pusle_anim"
         style="width: 80px; height: 20px; margin-top: 1px; margin-right: auto; margin-left: auto"></div>

</article>
