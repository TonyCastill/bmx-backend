module.exports = (sequelize, DataTypes) => {
    const Experince = sequelize.define('experience', {
      id_experience: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(45),
      },
      /**
       * Junior
       * Elite
       * Athlete
       * Non-Athlete
       */
      // years_required: {
      //   type: DataTypes.INTEGER
      // },
    }, {
      tableName: 'experience',
      timestamps: false,
    });
  
    return Experince;
  };
  