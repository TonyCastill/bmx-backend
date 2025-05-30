module.exports = (sequelize, DataTypes) => {
    const Participation = sequelize.define('participation', {
      id_athlete: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      stage_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      ranking: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      score: {
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
  