"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class tbl_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      tbl_user.hasMany(models.tbl_review, {
        foreignKey: "provider_id",
        sourceKey: "user_id",
        as: "reviews",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      tbl_user.hasMany(models.tbl_recent_work, {
        foreignKey: "provider_id",
        sourceKey: "user_id",
        as: "recent_work",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  tbl_user.init(
    {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      full_name: DataTypes.STRING,
      password: DataTypes.STRING,
      password_token: DataTypes.STRING,
      email: DataTypes.STRING,
      country_code: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      profile_image: DataTypes.STRING,
      type: { type: DataTypes.ENUM, values: ["provider", "customer"] },
      is_active: DataTypes.BOOLEAN,
      approval_status: {
        type: DataTypes.ENUM,
        values: ["pending", "approved", "rejected"],
        defaultValue: "pending",
      },
      expiration_date: DataTypes.STRING,
      month: DataTypes.STRING,
      is_plan_purchased: DataTypes.BOOLEAN,
      price: DataTypes.STRING,
      address: DataTypes.TEXT,
      about: DataTypes.TEXT,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      verification_token: { type: DataTypes.STRING },
      is_service_created: DataTypes.BOOLEAN,
      is_email_verified: DataTypes.BOOLEAN,
      is_deleted: DataTypes.BOOLEAN,
      is_featured: DataTypes.BOOLEAN,
      stripe_account_id: DataTypes.STRING,
      stripe_customer_id: DataTypes.STRING,
      is_details_submitted: DataTypes.BOOLEAN,
      is_verification_done:DataTypes.BOOLEAN,
      is_notification_on:DataTypes.BOOLEAN
    },
    {
      hooks: {
        beforeCreate: function (user, options) {
          console.log("user", user);
          if (user.password) {
            return bcrypt
              .hash(user.password, 10)
              .then((hash) => {
                user.password = hash;
              })
              .catch((err) => {
                throw new Error();
              });
          }
        },
        beforeUpdate: function (user, options) {
          if (user.password) {
            return bcrypt
              .hash(user.password, 10)
              .then((hash) => {
                user.password = hash;
              })
              .catch((err) => {
                console.log("TCL: err", err);
                throw new Error();
              });
          }
        },
      },

      sequelize,
      modelName: "tbl_user",
    }
  );
  tbl_user.prototype.validatePassword = function (password) {
    console.log(bcrypt.compareSync(password, this.password))
    return bcrypt.compareSync(password, this.password);
  };
  return tbl_user;
};
