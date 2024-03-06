'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_notification.belongsTo(models.tbl_event, {
        foreignKey: "event_id",
        as: "event",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      tbl_notification.belongsTo(models.tbl_user, {
        foreignKey: "sender_id",
        sourceKey:"user_id",
        as: "sender",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      tbl_notification.belongsTo(models.tbl_user, {
        foreignKey: "receiver_id",
        sourceKey:"user_id",
        as: "receiver",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      tbl_notification.belongsTo(models.tbl_event_ticket, {
        foreignKey: "event_ticket_id",
        as: "event_ticket",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      tbl_notification.belongsTo(models.tbl_service, {
        foreignKey: "service_id",
        as: "service",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  };
  tbl_notification.init({
    notification_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    is_read: DataTypes.BOOLEAN,
    notification_type: DataTypes.INTEGER,
    event_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    event_ticket_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_notification',
  });
  return tbl_notification;
};