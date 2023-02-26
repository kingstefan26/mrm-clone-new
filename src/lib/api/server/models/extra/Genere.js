import { DataTypes } from 'sequelize';

export const defineGenere = (sequelize) => {
	return sequelize.define('genere', {
		name: DataTypes.STRING
	});
};
