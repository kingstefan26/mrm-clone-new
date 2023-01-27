import {DataTypes} from "sequelize";

const defineGenere = (sequelize) => {
    return sequelize.define('genere', {
        name: DataTypes.STRING
    })
}

export { defineGenere }