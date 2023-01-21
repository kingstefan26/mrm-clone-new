import {DataTypes} from "sequelize";

const definePost = (sequelize) => {
    return sequelize.define('Post', {
        id: {type: DataTypes.STRING, primaryKey: true},
        title: DataTypes.STRING,
        authorId: DataTypes.STRING,
        created: DataTypes.STRING,
        published: DataTypes.BOOLEAN,
        posterAssetId: DataTypes.STRING,
        chapterCount: DataTypes.INTEGER
    })
}

export { definePost }