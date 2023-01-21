import {DataTypes} from "sequelize";

const defineGenere = (sequelize) => {
    return sequelize.define('Genere', {
        name: DataTypes.STRING,
        postId: DataTypes.STRING
    })
}

export { defineGenere }