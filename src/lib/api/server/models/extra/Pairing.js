import { DataTypes } from 'sequelize';

export const definePairing = (sequelize) => {
	return sequelize.define('pairing', {
		name: DataTypes.STRING
	});
};
