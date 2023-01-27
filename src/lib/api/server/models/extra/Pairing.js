import {DataTypes} from "sequelize";

const definePairing = (sequelize) => {
    return sequelize.define('pairing', {
        name: DataTypes.STRING
    })
}

export { definePairing }