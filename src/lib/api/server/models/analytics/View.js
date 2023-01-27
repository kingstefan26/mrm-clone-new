import {DataTypes} from "sequelize";

const defineView = (sequelize) => {
    return sequelize.define('view', {
        postId: DataTypes.STRING,
        chapterId: DataTypes.STRING
    })
}

export { defineView }