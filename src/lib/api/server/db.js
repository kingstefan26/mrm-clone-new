// /src/lib/server/db.js

import {Sequelize} from 'sequelize'
import {defineAsset} from "$lib/api/server/models/asset/Asset";
import {defineAssetData} from "$lib/api/server/models/asset/AssetVersion.js";

import {defineChapterData} from '$lib/api/server/models/Chapter.js';
import {definePost} from "$lib/api/server/models/Post.js";

import {defineAuthor} from "$lib/api/server/models/extra/Author.js";
import {defineCategory} from "$lib/api/server/models/extra/Category.js";
import {defineGenere} from "$lib/api/server/models/extra/Genere.js";
import {defineTag} from "$lib/api/server/models/extra/Tag.js";
import {definePairing} from "$lib/api/server/models/extra/Pairing.js";
import {defineScanlination} from "$lib/api/server/models/extra/Scanlination.js";
import {defineStatus} from "$lib/api/server/models/extra/Status.js";

import {defineUser} from "$lib/api/server/models/user/User.js";
import {defineBookmark} from "$lib/api/server/models/user/Bookmark.js";
import {defineView} from "$lib/api/server/models/analytics/View.js";


export const sequelize = new Sequelize(
    "db",
    "user",
    "pass",
    {
        host: "localhost",
        dialect: "sqlite",
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        storage: "database.sqlite",
        logging: false
    }
); // setup mock data // createMockData()
export const Asset = defineAsset(sequelize);

export const AssetVersion = defineAssetData(sequelize);
Asset.hasMany(AssetVersion)
AssetVersion.belongsTo(Asset)

export const Chapter = defineChapterData(sequelize);
Chapter.hasMany(Asset)
Asset.belongsTo(Chapter)

export const Post = definePost(sequelize);
Post.hasMany(Chapter)
Chapter.belongsTo(Post)

export const Category = defineCategory(sequelize);
Post.belongsToMany(Category, {through: "categoryPost"})


Category.hasMany(Post)
export const Author = defineAuthor(sequelize);
Post.belongsTo(Author, {through: "authorPost"})


Author.hasMany(Post)
export const Genere = defineGenere(sequelize);
Post.belongsToMany(Genere, {through: "generePost"})


Genere.hasMany(Post)
export const Tag = defineTag(sequelize);
Post.belongsToMany(Tag, {through: "tagPost"})

Tag.hasMany(Post)
export const Pairing = definePairing(sequelize);
Post.belongsTo(Pairing, {through: "pairingPost"})

Pairing.hasMany(Post)
export const Scanlination = defineScanlination(sequelize);
Post.belongsTo(Scanlination, {through: "scanlinationPost"})

Scanlination.hasMany(Post)
export const Status = defineStatus(sequelize);
Post.belongsTo(Status, {through: "statusPost"})

Status.hasMany(Post)

export const User = defineUser(sequelize);
export const Bookmark = defineBookmark(sequelize);
Bookmark.belongsTo(User, {through: "userBookmark"})
User.hasMany(Bookmark)

Bookmark.belongsTo(Post, {through: "postBookmark"})
Post.hasMany(Bookmark)

export const View = defineView(sequelize)