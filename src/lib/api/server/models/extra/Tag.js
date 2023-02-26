import { DataTypes } from 'sequelize';

export const defineTag = (sequelize) => {
	return sequelize.define('tag', {
		name: DataTypes.STRING
	});
};
