import { error } from '@sveltejs/kit';

/** @type {import('./$types').Load} */
export async function load({params, fetch}) {

    const feed = await fetch("/altfeed/feed.json").then(res => res.json())

    let post = undefined

    feed.entries.forEach(entry => {
        if (entry.title === params.title) {
            post = entry
        }
    })

    if (!post) {
        throw error(404, "Could not find this post");
    }

    const chapterIndex = params.chapter ? Number.parseInt(params.chapter) : 0

    const chapter = post.chapters[chapterIndex] ? post.chapters[chapterIndex] : post.chapters[0]

    chapter.chapter_media.forEach(mediaElement => {
        mediaElement.path = mediaElement.path.startsWith("http") ? mediaElement.path : "/asset" + mediaElement.path
    })

    return {
        current_chapter: chapterIndex,
        chapter,
        meta: {
            id: post.id,
            title: post.title,
            geners: post.geners,
            tags: post.tags,
            categories: post.categories,
            created: post.created,
            author: post.author,
            chapter_count: post.chapters.length,
            description: "HEY",
            poster_path: post.poster.path
        }
    }
}