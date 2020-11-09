"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.level, {
        foreignKey: "id_level",
        as: "level",
      });
    }
  }
  admin.init(
    {
      id_admin: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      nama_admin: DataTypes.STRING,
      id_level: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "admin",
      tableName: "admin",
    }
  );
  return admin;
};
