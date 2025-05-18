module.exports = (sequelize, DataTypes) => {
    const CompetitionCategoryStage = sequelize.define('competition_category_stage', {
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
      current_stage:{
        type: DataTypes.STRING(60),
        defaultValue: false,
      }
    }, {
      tableName: 'competition_category_stage',
      timestamps: false,
    });
  
    return CompetitionCategoryStage;
  };
  