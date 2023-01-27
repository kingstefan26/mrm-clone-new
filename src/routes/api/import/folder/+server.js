import {createAssetVersion} from "$lib/api/server/controler.js";
import {Asset, Chapter, Post} from "$lib/api/server/db.js";

export async function POST({locals, request}) {
    if (!locals.user.admin) {
        return new Response(JSON.stringify({status: "error", message: "You are not logged in"}), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }


    const title = 'pov: article'
    // generate radom uuid as the id
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // create a Post from meta.title
    const post = await Post.create({
        title: title,
        id: id,
        published: false
    })

    // create a chapter
    const chapter = await Chapter.create({
        name: "number One",
        published: true,
        indexInParentPost: 0
    })

    // add the chapter to the post
    await chapter.setPost(post)

    // read form data from request
    const formData = await request.formData()

    const metaText = formData.get('meta')
    const meta = JSON.parse(metaText)

    // find unique image types in forlder
    const imageTypes = new Set()
    for (const {formname} of meta.files) {
        const blob = formData.get(formname);
        if (blob.type.startsWith('image/')) {
            imageTypes.add(blob.type)
        }
    }

    // assemble a set of images for each type
    const images = {}
    for (const type of imageTypes) {
        images[type] = []
        for (const {formname} of meta.files) {
            const blob = formData.get(formname);
            if (blob.type === type) {
                images[type].push(blob)
            }
        }
        // sort images by their name, names must be numbed, like 'image-1.jpg'
        images[type].sort((a, b) => {
            // extract numer from name and compare them
            const aNum = parseInt(a.name.match(/(\d+)/)[0])
            const bNum = parseInt(b.name.match(/(\d+)/)[0])
            if (aNum < bNum) {
                return -1
            } else {
                return 1
            }
        })
    }

    // merge the images into one image object with all types
    const mergedImages = []
    for (let i = 0; i < images[Object.keys(images)[0]].length; i++) {
        const image = {}
        for (const type of imageTypes) {
            image[type] = images[type][i]
        }
        mergedImages.push(image)
    }

    let i = 0
    // create asset versions for each image
    for (const image of mergedImages) {
        const asset = await Asset.create({indexInChapter: i})
        await asset.setChapter(chapter)
        if (i === 0) {
            post.posterAssetId = asset.id
            await post.save()
        }
        i++
        for (const type of imageTypes) {
            const blob = image[type]
            // Get buffer from blob
            const assetBuffer = await blob.arrayBuffer()
            const version = await createAssetVersion(new Uint8Array(assetBuffer), 'en')
            await asset.addAssetData(version)
        }
    }

    return new Response(JSON.stringify({status: "ok", data: {id: id}}), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}