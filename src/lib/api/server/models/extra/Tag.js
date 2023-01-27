import {DataTypes} from "sequelize";

const defineTag = (sequelize) => {
    return sequelize.define('tag', {
        name: DataTypes.STRING
    })
}

export { defineTag }