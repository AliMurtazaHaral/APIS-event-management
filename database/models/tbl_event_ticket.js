"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbl_event_ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_event_ticket.belongsTo(models.tbl_event, {
        foreignKey: "event_id",
        as: "event",
        onDelete: "CASCADE",
      });
    }
  }
  tbl_event_ticket.init(
    {
      event_ticket_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      event_id: DataTypes.INTEGER,
      type: DataTypes.STRING,
      rate: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,
      sold: DataTypes.INTEGER,
      is_deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "tbl_event_ticket",
    }
  );
  return tbl_event_ticket;
};
