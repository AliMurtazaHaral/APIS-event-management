'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_admin_token = sequelize.define('tbl_admin_token', {
    admin_token_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    admin_id: DataTypes.INTEGER,
    access_token: DataTypes.TEXT
  }, {});
  tbl_admin_token.associate = function (models) {
    // associations can be defined here
  };
  return tbl_admin_token;
};