module.exports = (sequelize, DataTypes) => {
    const Logs = sequelize.define('logs', {
      log_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      action: {
        type: DataTypes.STRING(100),
      },
      target_table: {
        type: DataTypes.STRING(100),
      },
      target_id: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING(45),
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'logs',
      timestamps: false,
    });
  
    return Logs;
  };
  