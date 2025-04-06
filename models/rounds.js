module.exports = (sequelize, DataTypes) => {
    const Rounds = sequelize.define('rounds', {
      participation_athlete_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      participation_competition_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      participation_category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      round: {
        type: DataTypes.INTEGER,
      },
      starting_position: {
        type: DataTypes.INTEGER,
      },
      arriving_place: {
        type: DataTypes.INTEGER,
      },
    }, {
      tableName: 'rounds',
      timestamps: false,
    });
  
    return Rounds;
  };
  