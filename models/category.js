module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('category', {
      idcategory: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(45),
      },
      min_age: {
        type: DataTypes.INTEGER,
      },
      max_age: {
        type: DataTypes.INTEGER,
      },
      bicycle_id: {
        type: DataTypes.INTEGER,
      },
      experience_id: {
        type: DataTypes.INTEGER,
      },
    }, {
      tableName: 'category',
      timestamps: false,
    });
  
    return Category;
  };
  