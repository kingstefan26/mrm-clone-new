import {DataTypes, Model} from "sequelize";

export const createCategory = (sequelize) => {
    Category.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'category'
    });
}

export class Category extends Model {}