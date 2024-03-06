'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_recent_work extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tbl_recent_work.init({
    media_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    url: DataTypes.STRING,
    provider_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_recent_work',
  });
  return tbl_recent_work;
};