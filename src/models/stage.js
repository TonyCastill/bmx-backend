const category = require("./category");

module.exports = (sequelize, DataTypes) => {
  const Stage = sequelize.define(
    "stage",
    {
      id_stage: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      set_global: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      competition_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_last_set: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage_tracking: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      locked:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      tableName: "stage",
      timestamps: false,
    }
  );

  return Stage;
};
