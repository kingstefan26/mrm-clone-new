import { DataTypes } from 'sequelize';

export const defineBookmark = (sequelize) => {
	return sequelize.define('bookmark', {
		note: DataTypes.STRING
	});
};
