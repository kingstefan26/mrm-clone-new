import { DataTypes } from 'sequelize';

export const defineCategory = (sequelize) => {
	return sequelize.define('category', {
		name: DataTypes.STRING
	});
};
