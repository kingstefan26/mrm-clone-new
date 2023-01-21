import {DataTypes} from "sequelize";

const defineCategory = (sequelize) => {
    return sequelize.define('Category', {
        name: DataTypes.STRING,
        postId: DataTypes.STRING
    })
}

export { defineCategory }