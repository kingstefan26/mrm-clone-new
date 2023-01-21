import {getAssetData} from "$lib/api/server/controler.js";
import {error} from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({params, fetch, url, request}){
    const asset = await getAssetData(params.id)
    if(asset === undefined) {
        throw error(404, 'Invalid Id')
    }

    let version = url.searchParams.get('version')

    version = version ? version : asset.default_version
    let path = asset.versions[version].path

    const accepts = request.headers.get('accept')
    const acceptsWebp = accepts.includes('webp')
    const acceptsAvif = accepts.includes('avif')
    const acceptsJxl = accepts.includes('jxl')

    if(asset.versions.webp && acceptsWebp){
        path = asset.versions['webp'].path
    }

    if(asset.versions.avif && acceptsAvif){
        path = asset.versions['avif'].path
    }

    if(asset.versions.jxl && acceptsJxl){
        path = asset.versions['jxl'].path
    }

    if(!path){
        throw error(404, 'Invalid version')
    }

    const res = await fetch(path)

    return new Response(res.body, {
        headers: {
            "Content-Type": res.headers.get('content-type'),
            "Cache-Control": "max-age=604800, public, immutable",
            "Access-Control-Allow-Origin": "https://*.kokoniara.software"
        }
    })
}