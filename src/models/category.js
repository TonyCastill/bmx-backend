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
      gender: {
        type: DataTypes.ENUM('HOMBRE', 'MUJER'),
      },
      min_age: {
        type: DataTypes.INTEGER,
      },
      max_age: {
        type: DataTypes.INTEGER,
      },
      bicycle_id: {
        type: DataTypes.INTEGER,
        allowNull:true
      },
      experience_id: {
        type: DataTypes.INTEGER,
        allowNull:true
      },
    }, {
      tableName: 'category',
      timestamps: false,
    });
  
    return Category;
  };
  