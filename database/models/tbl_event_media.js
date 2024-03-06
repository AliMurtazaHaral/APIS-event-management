"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbl_event_media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbl_event_media.init(
    {
      event_media_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      event_id: DataTypes.INTEGER,
      type: { type: DataTypes.ENUM, values: ["image", "video"] },
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tbl_event_media",
    }
  );
  return tbl_event_media;
};
