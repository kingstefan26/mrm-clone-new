import { DataTypes } from 'sequelize';

export const defineStatus = (sequelize) => {
	return sequelize.define('status', {
		name: DataTypes.STRING
	});
};
