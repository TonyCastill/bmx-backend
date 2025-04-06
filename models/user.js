module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
      id_users: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    }, {
      tableName: 'users',
      timestamps: false,
    });
  
    return User;
  };
  