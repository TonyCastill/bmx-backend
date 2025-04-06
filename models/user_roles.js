module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('user_roles', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    }, {
      tableName: 'user_roles',
      timestamps: false,
    });
  
    return UserRole;
  };
  