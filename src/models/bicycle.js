module.exports = (sequelize, DataTypes) => {
    const Bicycle = sequelize.define('bicycle', {
      id_bicycle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      inches: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      }
    }, {
      tableName: 'bicycle',
      timestamps: false,
    });
  
    return Bicycle;
  };
  