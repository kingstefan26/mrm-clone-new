import {DataTypes} from "sequelize";

const defineBookmark = (sequelize) => {
    return sequelize.define('bookmark', {
        note: DataTypes.STRING
    })
}

export { defineBookmark }