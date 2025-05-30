module.exports = (sequelize, DataTypes) => {
    const Hit = sequelize.define('hit', {
      id_hit: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      stage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      active:{
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      elimination_rule:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    }, {
      tableName: 'hit',
      timestamps: false,
    });
  
    return Hit;
  };
  