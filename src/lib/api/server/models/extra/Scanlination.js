import { DataTypes } from 'sequelize';

export const defineScanlination = (sequelize) => {
	return sequelize.define('scanlination', {
		groupName: DataTypes.STRING
	});
};
