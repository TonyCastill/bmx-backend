module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('group', {
      id_group: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      competition_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      locked:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      stage:{
        type: DataTypes.STRING(45),
        allowNull:true,
        defaultValue: "round_0",
      }

    }, {
      tableName: 'group',
      timestamps: false,
    });
  
    return Group;
  };
  