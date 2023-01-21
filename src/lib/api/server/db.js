// /src/lib/server/db.js

import {Sequelize} from 'sequelize'
import {defineAsset} from "$lib/api/server/models/Asset.js";
import {defineAuthor} from "$lib/api/server/models/Author.js";
import {defineCategory} from "$lib/api/server/models/Category.js";
import {defineChapterAsset} from "$lib/api/server/models/ChapterAsset.js";
import {defineChapterData} from "$lib/api/server/models/ChapterData.js";
import {defineGenere} from "$lib/api/server/models/Genere.js";
import {definePost} from "$lib/api/server/models/Post.js";
import {defineTag} from "$lib/api/server/models/Tag.js";
import {defineAssetData} from "$lib/api/server/models/AssetData.js";

const sequelize = new Sequelize(
    "database",
    process.env.USER,
    process.env.PASSWORD,
    {
        host: "0.0.0.0",
        dialect: "sqlite",
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        storage: "database.sqlite"
    }
);


// we instantiate our models
const Asset        = defineAsset(sequelize)
const AssetData    = defineAssetData(sequelize)
const Author       = defineAuthor(sequelize)
const Category     = defineCategory(sequelize)
const ChapterAsset = defineChapterAsset(sequelize)
const ChapterData  = defineChapterData(sequelize)
const Genere       = defineGenere(sequelize)
const Post         = definePost(sequelize)
const Tag          = defineTag(sequelize)

import * as controler from "$lib/api/server/controler.js"
function createMockData() {
    // create mock data from the data in controler.js
    for (const post of controler.mockData.entries) {
        if (!post.poster) continue
        Post.create({
            id: post.id,
            title: post.title,
            authorId: post.authorId,
            created: post.created,
            published: post.published,
            posterAssetId: post.poster,
            chapterCount: post.chapterCount
        }).then(()=>{}).catch(err => {
            console.log("Error creating post: ", post)
        })
    }
    for(const assetData of controler.mockAssets) {
        AssetData.create({
            parent_id: assetData.parent_id,
            path: assetData.path,
            width: assetData.width,
            height: assetData.height,
            lang: assetData.lang,
            format: assetData.format
        }).then(()=>{}).catch(err => {
            console.log("Error creating assetData: ", assetData)
        })
    }

    for(const asset of controler.mockAssetData){
        Asset.create({
            id: asset.id,
            parentPost: asset.parentPost,
            parentChapter: asset.parentChapter
        }).then(()=>{}).catch(err => {
            console.log("Error creating asset: ", asset)
        })
    }

    for(const chapterAsset of controler.chapterAsset){
        ChapterAsset.create({
            id: crypto.randomUUID(),
            chapter_id: chapterAsset.chapterId,
            asset_id: chapterAsset.assetId,
            indexInChapter: chapterAsset.index_in_chapter
        }).then(()=>{}).catch(err => {
            console.log("Error creating chapterAsset: ", chapterAsset)
        })
    }


    for(const chapterData of controler.mockChapterData){
        ChapterData.create({
            id: chapterData.id,
            published: chapterData.published,
            postid: chapterData.postId,
            indexInParentPost: chapterData.indexInParentPost,
            name: chapterData.name
        }).then(()=>{}).catch(err => {
            console.log("Error creating mock data: ", chapterData)
        })
    }

    for (const author of controler.authorData) {
        Author.create({
            id: author.id,
            name: author.name,
        }).then(()=>{}).catch(err => {
            console.log("Error creating mock data: ", author)
        })
    }

    for(const category of controler.categoryData){
        Category.create({
            postId: category.id,
            name: category.name,
        }).then(()=>{}).catch(err => {
            console.log("Error creating mock data: ", category)
        })
    }

    for(const genere of controler.genersData){
        Genere.create({
            postId: genere.id,
            name: genere.name,
        }).then(()=>{}).catch(err => {
            console.log("Error creating mock data: ", genere)
        })
    }


    for(const tag of controler.tagData){
        Tag.create({
            postId: tag.id,
            name: tag.name,
        }).then(()=>{}).catch(err => {
            console.log("Error creating mock data: ", tag)
        })
    }



}

// authenticate with the database
sequelize
    .authenticate()
    .then(() => {
        console.log("Connection established.");



        Asset.sync();
        AssetData.sync()
        Author.sync()
        Category.sync()
        ChapterAsset.sync()
        ChapterData.sync()
        Genere.sync()
        Post.sync()

        Asset.hasMany(AssetData, {foreignKey: "parent_id"})
        AssetData.belongsToMany(Asset, {foreignKey: "id"})

        // setup mock data
        // createMockData()

        Tag.sync()
    })
    .catch(err => {
        console.log("Unable to connect to database: ", err);
    });

// relations between models
// StoryList.hasOne(Story, {foreignKey: "cid"})
// Story.belongsTo(StoryList, {foreignKey: "cid"})

export {sequelize, Asset, AssetData, Author, Category, ChapterAsset, ChapterData, Genere, Post, Tag}
