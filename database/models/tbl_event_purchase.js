'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_event_purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_event_purchase.belongsTo(models.tbl_user, {
        foreignKey: "customer_id",
        source_id:"user_id",
        as: "customer",
        onDelete: "CASCADE",
      });

      tbl_event_purchase.belongsTo(models.tbl_user, {
        foreignKey: "provider_id",
        source_id: "user_id",
        as: "provider",
        onDelete: "CASCADE",
      });

      tbl_event_purchase.belongsTo(models.tbl_event, {
        foreignKey: "event_id",
        as: "event",
        onDelete: "CASCADE",
      });
      tbl_event_purchase.belongsTo(models.tbl_event_ticket, {
        foreignKey: "event_ticket_id",
        as: "event_ticket",
        onDelete: "CASCADE",
      });
    }
  };
  tbl_event_purchase.init({
    purchase_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    order_id: DataTypes.STRING,
    total_amount: DataTypes.FLOAT,
    provider_amount: DataTypes.FLOAT,
    stripe_customer_id: DataTypes.STRING,
    card_id: DataTypes.STRING,
    provider_account_id: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    provider_id: DataTypes.INTEGER,
    event_id: DataTypes.INTEGER,
    event_ticket_id: DataTypes.INTEGER,
    ticket: DataTypes.INTEGER,
    transaction_id: DataTypes.STRING,
    transfer_id: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    receipt: DataTypes.STRING,
    commission: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'tbl_event_purchase',
  });
  return tbl_event_purchase;
};