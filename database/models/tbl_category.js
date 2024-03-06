'use strict';
const {
  Model
} = require('sequelize');

const { CATEGORY_TYPE } = require("../../config/constant")

module.exports = (sequelize, DataTypes) => {
  class tbl_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_category.hasMany(models.tbl_category, {
        foreignKey: 'category_id',
        sourceKey: 'parent_id',
        as: 'parent_category'
      });
    }
  };
  tbl_category.init({
    category_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    type: {
      type: DataTypes.ENUM,
      values: Object.values(CATEGORY_TYPE),
    },

    category_name: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'tbl_category',
  });
  return tbl_category;
};