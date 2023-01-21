import {DataTypes} from "sequelize";

const defineAssetData = (sequelize) => {
    return sequelize.define('AssetData', {
        id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
        parent_id: DataTypes.STRING,
        path: DataTypes.STRING,
        width: DataTypes.NUMBER,
        height: DataTypes.NUMBER,
        lang: DataTypes.STRING,
        format: DataTypes.STRING
    })
}

export { defineAssetData }