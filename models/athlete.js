module.exports = (sequelize, DataTypes) => {
    const Athlete = sequelize.define('athlete', {
      id_athlete: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      CURP: {
        type: DataTypes.STRING(18),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATE,
      },
      current_age: {
        type: DataTypes.INTEGER,
      },
      gender: {
        type: DataTypes.CHAR(1),
      },
      years_competing: {
        type: DataTypes.STRING(45),
      },
      club_id_club: {
        type: DataTypes.INTEGER,
      },
      club_city_id_city: {
        type: DataTypes.INTEGER,
      },
    }, {
      tableName: 'athlete',
      timestamps: false,
    });
  
    return Athlete;
};
  