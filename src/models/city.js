module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define('city', {
      id_city: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      city: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
      }
    }, {
      tableName: 'city',
      timestamps: false,
    });
  
    return City;
  };
  