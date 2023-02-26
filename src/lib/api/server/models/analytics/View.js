import { DataTypes } from 'sequelize';

export const defineView = (sequelize) => {
	return sequelize.define('view', {
		postId: DataTypes.STRING,
		chapterId: DataTypes.STRING
	});
};
