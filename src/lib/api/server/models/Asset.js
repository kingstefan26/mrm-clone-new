import {DataTypes} from "sequelize";

const defineAsset = (sequelize) => {
    return sequelize.define('Asset', {
        id: {type: DataTypes.STRING, primaryKey: true, allowNull: false},
        parentPost: DataTypes.STRING,
        parentChapter: DataTypes.STRING,
    })
}

export { defineAsset }