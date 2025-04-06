module.exports = (sequelize, DataTypes) => {
    const Competition = sequelize.define('competition', {
      id_competition: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(150),
      },
      date: {
        type: DataTypes.DATE,
      },
    }, {
      tableName: 'competition',
      timestamps: false,
    });
  
    return Competition;
  };
  