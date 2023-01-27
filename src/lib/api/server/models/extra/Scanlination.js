import {DataTypes} from "sequelize";

const defineScanlination = (sequelize) => {
    return sequelize.define('scanlination', {
        groupName: DataTypes.STRING
    })
}

export { defineScanlination }