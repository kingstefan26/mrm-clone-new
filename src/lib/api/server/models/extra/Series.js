import { DataTypes } from 'sequelize';

export const defineSeries = (sequelize) => {
	return sequelize.define('series', {
		name: DataTypes.STRING
	});
};
