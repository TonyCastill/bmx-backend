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
      // date: {
      //   type: DataTypes.DATEONLY,
      // },
      // city_id: {
        // type: DataTypes.INTEGER,
        // allowNull: false
      // },
    }, {
      tableName: 'competition',
      timestamps: false,
    });
  
    return Competition;
  };
  