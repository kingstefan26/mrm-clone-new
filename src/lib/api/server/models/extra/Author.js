import { DataTypes } from 'sequelize';

export const defineAuthor = (sequelize) => {
	return sequelize.define('Author', {
		name: DataTypes.STRING,
		longName: DataTypes.STRING
	});
};
