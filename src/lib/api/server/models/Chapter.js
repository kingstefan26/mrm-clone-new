import { DataTypes } from 'sequelize';

export const defineChapterData = (sequelize) => {
	return sequelize.define('chapter', {
		published: DataTypes.BOOLEAN,
		indexInParentPost: DataTypes.INTEGER,
		name: DataTypes.STRING,
		western: DataTypes.BOOLEAN,
		sensitiveContent: DataTypes.BOOLEAN
	});
};
