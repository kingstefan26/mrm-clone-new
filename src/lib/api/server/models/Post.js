import { DataTypes } from 'sequelize';

export const definePost = (sequelize) => {
	return sequelize.define('post', {
		id: { type: DataTypes.STRING, primaryKey: true },
		title: DataTypes.STRING,
		created: DataTypes.STRING,
		published: DataTypes.BOOLEAN,
		posterAssetId: DataTypes.STRING,
		chapterCount: DataTypes.INTEGER,
		altTitle: DataTypes.STRING,
		description: DataTypes.STRING,
		indexInSeries: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		}
	});
};
