<div class="spinner">
    <div class="spinner-1"></div>
    <div class="spinner-2"></div>
    <div class="spinner-3"></div>
</div>

<style>
    .spinner * {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        background-color: #919191;
        border-radius: 1rem;
        margin: 0 0.2rem;
    }
    .spinner .spinner-1 {
        animation: fade 1.1s ease-in-out 0.18s infinite both;
    }
    .spinner .spinner-2 {
        animation: fade 1.1s ease-in-out 0.36s infinite both;
    }
    .spinner .spinner-3 {
        animation: fade 1.1s ease-in-out 0.54s infinite both;
    }

    @keyframes fade {
        0% {
            opacity: 0.35;
            transform: scale(0.87);
        }
        37.5% {
            opacity: 1;
            transform: scale(1);
        }
        75% {
            opacity: 0.35;
            transform: scale(0.87);
        }
        100% {
            opacity: 0.35;
            transform: scale(0.87);
        }
    }
</style>