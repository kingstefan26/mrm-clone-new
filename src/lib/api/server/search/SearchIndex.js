import {Author, Category, Genere, Pairing, Post, Series, Tag} from "$lib/api/server/db.js";
import fuzzysort from "fuzzysort";

let index = [
    // filled with stub data to show how it looks, cuz we don't do typescript round here
    {
        type: "post",
        snowflake: "stub title",
    },
    {
        type: "tag",
        snowflake: "Example tag",
    }
]

export default class SearchIndex {

    static async search(query, options) {
        // mesure time
        console.time("search")
        const newVar = await this.getDataFromIndexResults(await this.fuzzySearch(query, options));
        console.timeEnd("search")
        return newVar
    }

    static async fuzzySearch(query="", options = {limit: 10}) {
        if(query === ""){
            return []
        }
        const res = fuzzysort.go(query, index, {key: "snowflake", limit: options.limit})
        return res.map(r => r.obj)
    }

    static async recreateIndex() {
        const tempIndex = []
        await Promise.all([
            Post.findAll().then(posts => {
                posts.forEach(post => {
                    tempIndex.push({
                        type: "post",
                        snowflake: post.title
                    })
                })
            }),
            Tag.findAll().then(tags => {
                tags.forEach(tag => {
                    tempIndex.push({
                        type: "tag",
                        snowflake: tag.name
                    })
                })
            }),
            Series.findAll().then(series => {
                series.forEach(serie => {
                    tempIndex.push({
                        type: "series",
                        snowflake: serie.name
                    })
                })
            }),
            Author.findAll().then(authors => {
                authors.forEach(author => {
                    tempIndex.push({
                        type: "author",
                        snowflake: author.name
                    })
                })
            }),
            Category.findAll().then(categories => {
                categories.forEach(category => {
                    tempIndex.push({
                        type: "category",
                        snowflake: category.name
                    })
                })
            }),
            Genere.findAll().then(generes => {
                generes.forEach(genere => {
                    tempIndex.push({
                        type: "genre",
                        snowflake: genere.name
                    })
                })
            }),
            Pairing.findAll().then(pairings => {
                pairings.forEach(pairing => {
                    tempIndex.push({
                        type: "pairing",
                        snowflake: pairing.name
                    })
                })
            })
        ])


        // save the index
        index = tempIndex
    }


    static decodeIndexResults(results = [""]) {
        return results.map(result => {
            return this.fromEncoded(result)
        })
    }

    static toEncoded(entry = {type: "", snowflake: ""}) {
        if(entry.type === "pairing"){
            return "z" + entry.snowflake
        } else {
            return entry.type[0] + entry.snowflake
        }
    }

    static fromEncoded(encoded = "") {
        if(encoded === ""){
            throw new Error("Empty encoded string")
        }
        const type = encoded[0]
        // the rest of the result is the snowflake
        // eg. "pEpic post", or "tEpic tag"
        const snowflake = encoded.slice(1)

        // p for post
        if(type === "p"){
            return {
                type: "post",
                snowflake
            }
        } else if(type === "s"){
            return {
                type: "series",
                snowflake
            }
        } else if(type === "a"){
            return {
                type: "author",
                snowflake
            }
        } else if(type === "t"){
            return {
                type: "tag",
                snowflake
            }
        } else if(type === "c"){
            return {
                type: "category",
                snowflake
            }
        } else if(type === "g"){
            return {
                type: "genre",
                snowflake
            }
        } else if(type === "z"){
            return {
                type: "pairing",
                snowflake
            }
        } else {
            console.error(`Unknown type ${type} in encoded index ${encoded}`)
        }
    }

    static async getDataFromIndexResults(decodedResults = [{type: "", snowflake: ""}]) {
        let map = decodedResults.map(async result => {
            if (result.type === "post") {
                const post = await Post.findOne({
                    where: {
                        title: result.snowflake
                    }
                })

                return {
                    type: "post",
                    contents: {
                        id: post.id,
                        title: post.title,
                        posterAssetId: post.posterAssetId,
                    },
                    link: `/post/${post.id}`
                }
            } else if (result.type === "series") {
                return {
                    type: "series",
                    contents: result.snowflake,
                    link: `/series/${result.snowflake}`
                }

            } else if (result.type === "author") {
                return {
                    type: "author",
                    contents: result.snowflake,
                    link: `/author/${result.snowflake}`
                }
            } else if (result.type === "tag") {
                return {
                    type: "tag",
                    contents: result.snowflake,
                    link: `/tag/${result.snowflake}`
                }
            } else if (result.type === "category") {
                return {
                    type: "category",
                    contents: result.snowflake,
                    link: `/category/${result.snowflake}`
                }
            } else if (result.type === "genre") {
                return {
                    type: "genre",
                    contents: result.snowflake,
                    link: `/genre/${result.snowflake}`
                }
            } else if (result.type === "pairing") {
                return {
                    type: "pairing",
                    contents: result.snowflake,
                    link: `/pairing/${result.snowflake}`
                }
            } else {
                console.error(`Unknown type ${result.type} in result ${result}`)
            }
        });
        map = await Promise.all(map)
        return map;

    }
}