import {DataTypes} from "sequelize";

const defineChapterAsset = (sequelize) => {
    return sequelize.define('ChapterAsset', {
        id: {type: DataTypes.STRING, primaryKey: true, allowNull: false},
        chapterId: DataTypes.STRING,
        assetId: DataTypes.STRING,
        indexInChapter: DataTypes.INTEGER,
    })
}

export { defineChapterAsset }