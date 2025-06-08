module.exports = (sequelize, DataTypes) => {
    const Penalty = sequelize.define('penalty', {
      id_penalty: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      flag: {
        type: DataTypes.STRING(150),
      },
      penalty: {
        type: DataTypes.INTEGER,
      },
      // date: {
      //   type: DataTypes.DATEONLY,
      // },
      // city_id: {
        // type: DataTypes.INTEGER,
        // allowNull: false
      // },
    }, {
      tableName: 'penalty',
      timestamps: false,
    });
  
    return Penalty;
  };
  