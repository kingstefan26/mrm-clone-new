export default function (obj) {
    const a = `<script type="application/ld+json">${JSON.stringify(
        obj,
        null,
        2
    )}</script>`
    console.log(a)
    return a
}