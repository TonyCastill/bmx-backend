module.exports = (sequelize, DataTypes) => {
    const Club = sequelize.define('club', {
      id_club: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      club: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
      }
    }, {
      tableName: 'club',
      timestamps: false,
    });
  
    return Club;
  };
  