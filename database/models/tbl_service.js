'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_service.belongsTo(models.tbl_category, {
        foreignKey: "category_id",
        sourceKey: "category_id",
        as: "parent_category",
        onDelete: "CASCADE",
      });
      tbl_service.belongsTo(models.tbl_category, {
        foreignKey: "sub_category_id",
        sourceKey: "category_id",
        as: "sub_category",
        onDelete: "CASCADE",
      });
      tbl_service.belongsTo(models.tbl_user, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  };
  tbl_service.init({
    service_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    sub_category_id: DataTypes.INTEGER,
    image: DataTypes.STRING,
    rate: DataTypes.FLOAT,
    service_longitude: DataTypes.STRING,
    service_latitude: DataTypes.STRING,
    service_location: DataTypes.TEXT,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'tbl_service',
  });
  return tbl_service;
};