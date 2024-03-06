"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbl_review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_review.belongsTo(models.tbl_user, {
        foreignKey: "given_by_id",
        as: "given_by",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      
    }
  }
  tbl_review.init(
    {
      review_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      provider_id: DataTypes.INTEGER,
      given_by_id: DataTypes.INTEGER,
      review: DataTypes.STRING,
      rating: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "tbl_review",
    }
  );
  return tbl_review;
};
