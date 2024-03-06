"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbl_user_token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbl_user_token.init(
    {
      token_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      token: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      device_type: { type: DataTypes.ENUM, values: ["Ios", "Android"] },
      device_token: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "tbl_user_token",
    }
  );
  return tbl_user_token;
};
