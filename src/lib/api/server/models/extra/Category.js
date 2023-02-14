import {DataTypes} from "sequelize";

const defineCategory = (sequelize) => {
    return sequelize.define('category', {
        name: DataTypes.STRING
    })
}

export { defineCategory }