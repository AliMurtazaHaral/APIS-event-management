"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbl_country_code extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbl_country_code.init(
    {
      country_code_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      country_short_name: DataTypes.STRING,
      country_name: DataTypes.STRING,
      country_code: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "tbl_country_code",
    }
  );
  return tbl_country_code;
};
