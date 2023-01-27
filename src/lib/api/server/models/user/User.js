import {DataTypes} from "sequelize";

const defineUser = (sequelize) => {
    return sequelize.define('user', {
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        passHash: DataTypes.STRING,
        salt: DataTypes.STRING,
        admin: DataTypes.BOOLEAN
    })
}

export { defineUser }