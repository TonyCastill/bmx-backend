module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('roles', {
      id_roles: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    }, {
      tableName: 'roles',
      timestamps: false,
    });
  
    return Role;
  };
  