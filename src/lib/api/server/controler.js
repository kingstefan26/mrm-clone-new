import {TokenGenerator} from "$lib/api/server/token-util.js";

const mockData = {
    entries: [
        {
            id: "Gladiolus",
            title: "Gladiolus",
            author: "atcesolcyc",
            created: 1673583067,
            geners: ["Bara/ Muscle", "Yaoi"],
            tags: ["Big Penis", "Tattoo", "Uncensored"],
            categories: ["CG/ Art"],
            chapter_count: 1,
            chapters: [
                {
                    id: "testid2",
                    name: "first",
                    chapter_media: [
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/0.jpg.avif",
                            "height": 825,
                            "width": 989
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/1.jpg.avif",
                            "height": 1047,
                            "width": 845
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/2.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/3.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/4.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/5.jpg.avif",
                            "height": 1210,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/6.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/7.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/8.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/9.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/10.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/11.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/12.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/13.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/14.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/15.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/16.jpg.avif",
                            "height": 1178,
                            "width": 950
                        },
                        {
                            "path": "/[atcesolcyc]%20Gladiolus/17.jpg.avif",
                            "height": 1178,
                            "width": 950
                        }

                    ]
                }
            ],
            "poster": {
                "path": "/asset/[atcesolcyc] Gladiolus/0.jpg"
            }
        },
        {
            id: "Jogging",
            title: "Jogging",
            author: "Tarutoru",
            created: 1673583067,
            geners: ["Bara/ Muscle", "Yaoi"],
            tags: ["Blowjob", "Public Sex/ Exhibitionism"],
            categories: ["CG/ Art"],
            chapters: [
                {
                    id: "testid2",
                    name: "first",
                    chapter_media: [
                        {
                            "path": "/Tarutoru_Jogging/1.jpg",
                            "height": 1000,
                            "width": 1331
                        },
                        {
                            "path": "/Tarutoru_Jogging/2.jpg",
                            "height": 1000,
                            "width": 1331
                        },
                        {
                            "path": "/Tarutoru_Jogging/3.jpg",
                            "height": 1000,
                            "width": 1331
                        },
                        {
                            "path": "/Tarutoru_Jogging/4.jpg",
                            "height": 1000,
                            "width": 1331
                        },
                        {
                            "path": "/Tarutoru_Jogging/5.jpg",
                            "height": 1210,
                            "width": 1331
                        },
                        {
                            "path": "/Tarutoru_Jogging/6.jpg",
                            "height": 1000,
                            "width": 1331
                        },
                        {
                            "path": "/Tarutoru_Jogging/7.jpg",
                            "height": 1000,
                            "width": 1483
                        },
                        {
                            "path": "/Tarutoru_Jogging/8.jpg",
                            "height": 1000,
                            "width": 1483
                        },
                        {
                            "path": "/Tarutoru_Jogging/9.jpg",
                            "height": 1000,
                            "width": 1483
                        },
                        {
                            "path": "/Tarutoru_Jogging/10.jpg",
                            "height": 1000,
                            "width": 1483
                        },
                        {
                            "path": "/Tarutoru_Jogging/11.jpg",
                            "height": 1000,
                            "width": 1483
                        },
                        {
                            "path": "/Tarutoru_Jogging/12.jpg",
                            "height": 1000,
                            "width": 1483
                        },
                        {
                            "path": "/Tarutoru_Jogging/13.jpg",
                            "height": 1000,
                            "width": 1483
                        },
                        {
                            "path": "/Tarutoru_Jogging/14.jpg",
                            "height": 1000,
                            "width": 1483
                        }
                    ]
                }
            ],
            chapter_count: 1,
            poster: {
                path: "/asset/Tarutoru_Jogging/thumb.avif"
            }
        },
        {
            id: "Testing story",
            title: "Testing story",
            author: "Kokoniara",
            created: 1673640145,
            geners: ["Testing genere"],
            tags: ["Test tag 1", "Test tag 2"],
            categories: ["CG/ Art"],
            poster: {
                path: "/asset/test/1.png"
            },
            chapter_count: 2,
            chapters: [
                {
                    id: "12312df2as",
                    name: "The beggining",
                    chapter_media: [
                        {
                            "path": "/test/1.png",
                            height: 188,
                            width: 268
                        },
                        {
                            "path": "/test/2.png",
                            width: 720,
                            height: 1280
                        },
                        {
                            "path": "/test/3.png",
                            height: 720,
                            width: 1280
                        }
                    ]
                },
                {
                    id: "1s2312df2as",
                    name: "The Middle",
                    chapter_media: [
                        {
                            "path": "/test/4.jpg",
                            height: 461,
                            width: 576
                        }
                    ]
                }
            ]
        }
    ],
    total: 3
}

const mockUsers = [
    {
        username: "kokoniara",
        email: "kokoniara@kokoniara.software",
        id: "49e83ec0-5b61-41e8-b227-4054be3e447d",
        passHash: "7fcc7ca181147588e8a0515d7ec889611ccbe5d622a2ec169e592c711598ba8a",
        salt: "ar@",
        admin: true
    }
]

// gg from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
const getSHA256 = async (text = "") => {
    const msgUint8   = new TextEncoder().encode(text);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);     // hash the message
    const hashArray  = Array.from(new Uint8Array(hashBuffer));                      // convert buffer to byte array
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function verifyUserToken(token){
    try {
        return new TokenGenerator().decode(token, 'a')
    } catch (_) {
        return {}
    }
}
async function authenticateUser(email, passwrd){
    for (const user of mockUsers) {
        if (user.email !== email) {
            continue;
        }
        const hash = await getSHA256(user.salt + passwrd)
        if (hash !== user.passHash) {
            break
        } else {
            return new TokenGenerator(
                'a',
                'a',
                {
                    algorithm: 'HS256',
                    keyid: '1',
                    noTimestamp: false,
                    expiresIn: '10d',
                    notBefore: '0'
                }
            ).sign({
                username: user.username,
                id: user.id,
                admin: user.admin
            }, {
                audience: 'myaud',
                issuer: 'mrm-main-server',
                jwtid: '1',
                subject: 'user'
            });
        }
    }

    return ""
}


function getFeed(pageIndex = 0, pageSize = 10){

    const splitStart = pageIndex * pageSize


    const splitEnd = splitStart + pageSize

    const posts = JSON.parse(JSON.stringify(mockData.entries.slice(splitStart, splitEnd)))

    posts.forEach(post => {
        delete post.chapters
    })

    return {
        posts: posts,
        hasNextPage: splitEnd < mockData.entries.length,
        pagesAvalible: Math.ceil(mockData.entries.length / pageSize)
    }
}

function getChapter(postId = "", chapterIndex = 0) {
    let outChapter = undefined

    let totalChapters = undefined

    for (const post of mockData.entries) {
        if(post.id === postId) {
            let enChapter = post.chapters[chapterIndex]
            if(enChapter) {
                outChapter = enChapter
                totalChapters = post.chapters.length
            }
            break
        }
    }

    return {
        chapter: outChapter,
        chapterCount: totalChapters
    }
}

function getPost(postId = "") {
    let outPost = undefined

    for (const post of mockData.entries) {
        if(post.id === postId) {
            outPost = JSON.parse(JSON.stringify(post))
            break
        }
    }


    if(outPost) {
        delete outPost.chapters
    }

    return outPost
}



export { getFeed, getChapter, getPost, authenticateUser, verifyUserToken }