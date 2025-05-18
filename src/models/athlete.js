module.exports = (sequelize, DataTypes) => {
    const Athlete = sequelize.define('athlete', {
      id_athlete: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      CURP: {
        type: DataTypes.STRING(18),
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATEONLY,
      },
      current_age: {
        type: DataTypes.INTEGER,
        allowNull:true
      },
      gender: {
        type: DataTypes.ENUM('HOMBRE', 'MUJER'),
      },
      years_competing: {
        type: DataTypes.INTEGER,
      },
      club_id: {
        type: DataTypes.INTEGER,
        allowNull:true
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull:true
      },
    }, {
      tableName: 'athlete',
      timestamps: false,
    });
  
    return Athlete;
};
  