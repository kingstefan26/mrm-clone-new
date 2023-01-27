import {error} from '@sveltejs/kit';
import {getChapterWithAssets} from "$lib/api/server/controler.js";

/** @type {import('./$types').Load} */
export async function load({params}) {

    const chapter = await getChapterWithAssets(params.id, params.chapterId)

    if (!chapter) {
        return error(404, "Chapter not found")
    }

    chapter.assets.sort((a, b) => a.indexInParentChapter - b.indexInParentChapter)

    return {
        chapter
    }
}