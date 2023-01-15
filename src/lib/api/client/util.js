

async function getFeedPage(index = 0, fetch) {

    const reqUrl = `/api/feed${index > 0 ? `?page=${index}` : ""}`

    return await fetch(reqUrl).then(res => res.json());
}


async function getChapter(postId = "", chapterIndex = 0, fetch) {
    const reqUrl = `/api/chapter?id=${postId}&index=${chapterIndex}`

    return await fetch(reqUrl).then(res => res.json());
}

async function getPost(postId = "", fetch) {

    const reqUrl = `/api/post?id=${postId}`

    const req = await fetch(reqUrl).then((response) => response.text())

    if(req) {
        return JSON.parse(req)
    } else {
      return undefined
    }
}


export { getFeedPage, getChapter, getPost }