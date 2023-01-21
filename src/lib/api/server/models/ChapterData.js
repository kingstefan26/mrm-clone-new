import {DataTypes} from "sequelize";

const defineChapterData = (sequelize) => {
    return sequelize.define('ChapterData', {
        id: {type: DataTypes.STRING, primaryKey: true},
        published: DataTypes.BOOLEAN,
        postId: DataTypes.STRING,
        indexInParentPost: DataTypes.INTEGER,
        name: DataTypes.STRING,
        western: DataTypes.BOOLEAN,
        sensitiveContent: DataTypes.BOOLEAN
    })
}

export { defineChapterData }