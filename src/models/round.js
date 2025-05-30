module.exports = (sequelize, DataTypes) => {
    const Round = sequelize.define('round', {
      athlete_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      hit_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      round: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      starting_position: {
        type: DataTypes.INTEGER,
      },
      arriving_place: {
        type: DataTypes.INTEGER,
        allowNull: true,        
      },
      score:{
        type:DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      }
    }, {
      tableName: 'round',
      timestamps: false,
      alter:true
    });
  
    return Round;
  };
  