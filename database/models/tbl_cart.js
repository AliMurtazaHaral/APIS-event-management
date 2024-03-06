"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbl_cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_cart.belongsTo(models.tbl_event_ticket, {
        foreignKey: "event_ticket_id",
        as: "ticket_detail",
        onDelete: "CASCADE",
      });
      tbl_cart.belongsTo(models.tbl_service, {
        foreignKey: "service_id",
        as: "service",
        onDelete: "CASCADE",
      });
      tbl_cart.belongsTo(models.tbl_event, {
        foreignKey: "event_id",
        as: "event",
        onDelete: "CASCADE",
      });
    }
  }
  tbl_cart.init(
    {
      cart_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      event_ticket_id: DataTypes.INTEGER,
      service_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      start_date: DataTypes.DATEONLY,
      start_time: DataTypes.TIME,
      end_time:DataTypes.TIME,
      type: { type: DataTypes.ENUM, values: ["service", "event"] },
      quantity: DataTypes.INTEGER,
      total: DataTypes.FLOAT,
      event_id:DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "tbl_cart",
    }
  );
  return tbl_cart;
};
