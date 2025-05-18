module.exports = (sequelize, DataTypes) => {
    const Participation = sequelize.define('participation', {
      athlete_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      competition_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      ranking: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('registered', 'completed', 'disqualified'),
        defaultValue: 'registered',
      },
    }, {
      tableName: 'participation',
      timestamps: false,
    });
  
    return Participation;
  };
  