import {DataTypes} from "sequelize";

const defineTag = (sequelize) => {
    return sequelize.define('Tag', {
        name: DataTypes.STRING,
        postId: DataTypes.STRING
    })
}

export { defineTag }