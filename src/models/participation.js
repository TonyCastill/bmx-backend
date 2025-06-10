module.exports = (sequelize, DataTypes) => {
    const Participation = sequelize.define('participation', {
      id_participation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_athlete: {
        type: DataTypes.INTEGER,
        // primaryKey: true,
      },
      stage_id: {
        type: DataTypes.INTEGER,
        // primaryKey: true,
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
      porta_numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      last_result: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      tableName: 'participation',
      timestamps: false,
    });
  
    return Participation;
  };
  