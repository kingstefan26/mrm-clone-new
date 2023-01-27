import {DataTypes} from "sequelize";

const defineAsset = (sequelize) => {
    return sequelize.define('asset', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        indexInChapter: DataTypes.INTEGER
    })
}

export { defineAsset }