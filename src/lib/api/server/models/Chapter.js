import {DataTypes} from "sequelize";

const defineChapterData = (sequelize) => {
    return sequelize.define('chapter', {
        published: DataTypes.BOOLEAN,
        indexInParentPost: DataTypes.INTEGER,
        name: DataTypes.STRING,
        western: DataTypes.BOOLEAN,
        sensitiveContent: DataTypes.BOOLEAN
    })
}

export { defineChapterData }