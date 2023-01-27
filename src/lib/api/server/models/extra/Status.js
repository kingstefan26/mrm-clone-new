import {DataTypes} from "sequelize";

const defineStatus = (sequelize) => {
    return sequelize.define('status', {
        name: DataTypes.STRING
    })
}

export { defineStatus }