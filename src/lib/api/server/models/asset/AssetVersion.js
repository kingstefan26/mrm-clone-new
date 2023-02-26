import { DataTypes } from 'sequelize';

export const defineAssetData = (sequelize) => {
	return sequelize.define('assetData', {
		path: { type: DataTypes.STRING, allowNull: false },
		width: { type: DataTypes.NUMBER, allowNull: false },
		height: { type: DataTypes.NUMBER, allowNull: false },
		lang: { type: DataTypes.STRING, allowNull: false },
		format: { type: DataTypes.STRING, allowNull: false },
		etag: { type: DataTypes.STRING, allowNull: false },
		contentLength: { type: DataTypes.NUMBER, allowNull: false },
		mimeType: { type: DataTypes.STRING, allowNull: false }
	});
};
