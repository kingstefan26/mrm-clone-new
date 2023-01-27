import {error} from "@sveltejs/kit";
import * as fs from "fs";
import {Asset, AssetVersion} from "$lib/api/server/db.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({params, request}) {
    const accepts = request.headers.get('accept')
    const acceptsWebp = accepts.includes('webp')
    const acceptsAvif = accepts.includes('avif')
    const acceptsJxl = accepts.includes('jxl')




    const asset = await Asset.findOne({
        where: {
            id: params.id
        },
        include: [AssetVersion]
    })

    if (!asset) {
        throw error(404, 'Invalid Id')
    }

    let assetVersionUsed = asset.assetData.find((asset) => asset.lang === params.lang)
    assetVersionUsed = assetVersionUsed ? assetVersionUsed : asset.assetData[0]

    let path = assetVersionUsed.path

    const webp = asset.assetData.find((asset) => asset.format === 'webp')
    if (webp && acceptsWebp) {
        path = webp.path
    }

    const avif = asset.assetData.find((asset) => asset.format === 'heif')
    if (avif && acceptsAvif) {
        path = avif.path
    }

    const jxl = asset.assetData.find((asset) => asset.format === 'jxl')
    if (jxl && acceptsJxl) {
        path = jxl.path
    }

    if (!path) {
        throw error(404, 'Invalid version')
    }

    // read from file system using fs module
    const stream = fs.createReadStream(path)

    return new Response(stream, {
        headers: {
            "Content-Type": assetVersionUsed.mimeType,
            "Cache-Control": "max-age=31536000, public",
            "Access-Control-Allow-Origin": "https://*.kokoniara.software",
            "ETag": assetVersionUsed.etag
        }
    })
}