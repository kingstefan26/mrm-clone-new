import {DataTypes} from "sequelize";

const defineAuthor = (sequelize) => {
    return sequelize.define('Author', {
        id: {type: DataTypes.STRING, primaryKey: true},
        name: DataTypes.STRING,
        longName: DataTypes.STRING
    })
}

export { defineAuthor }