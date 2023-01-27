import {DataTypes} from "sequelize";

const defineAuthor = (sequelize) => {
    return sequelize.define('Author', {
        name: DataTypes.STRING,
        longName: DataTypes.STRING
    })
}

export { defineAuthor }