const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

// Import Models
db.Bicycle = require('./bicycle')(sequelize,DataTypes);
db.Athlete = require('./athlete')(sequelize, DataTypes);
db.Competition = require('./competition')(sequelize, DataTypes);
db.Category = require('./category')(sequelize, DataTypes);
db.Participation = require('./participation')(sequelize, DataTypes);
db.Round = require('./round')(sequelize, DataTypes);
db.Club = require('./club')(sequelize,DataTypes);
db.City = require('./city')(sequelize,DataTypes);
db.Experience = require('./experience')(sequelize,DataTypes);
db.Group = require('./group')(sequelize,DataTypes);
db.CompetitionCategoryStage = require("./competition_category_stage")(sequelize,DataTypes);
// Define Associations
// Club - Athlete
db.Club.hasMany(db.Athlete,{
  foreignKey: 'club_id',
  sourceKey:'id_club',
  onDelete: 'SET NULL',
  onUpdate:'CASCADE'
});
db.Athlete.belongsTo(db.Club,{
  foreignKey: 'club_id',
  targetId:'id_club'
});
// City - Athlete
db.City.hasMany(db.Athlete,{
  foreignKey: 'city_id',
  sourceKey:'id_city',
  onDelete: 'RESTRICT',
  onUpdate:'CASCADE'
});
db.Athlete.belongsTo(db.City,{
  foreignKey: 'city_id',
  targetId:'id_city'
});
// City - Competition
db.City.hasMany(db.Competition,{
  foreignKey: 'city_id',
  sourceKey:'id_city',
  onDelete: 'RESTRICT',
  onUpdate:'CASCADE'
});
db.Competition.belongsTo(db.City,{
  foreignKey: 'city_id',
  targetId:'id_city'
});
// Bicycle - Category
db.Bicycle.hasMany(db.Category,{
  foreignKey: 'bicycle_id',
  sourceKey:'id_bicycle',
  onDelete: 'SET NULL',
  onUpdate:'CASCADE'
});
db.Category.belongsTo(db.Bicycle,{
  foreignKey: 'bicycle_id',
  targetId:'id_bicycle'
});
// Experience - Category
db.Experience.hasMany(db.Category,{
  foreignKey: 'experience_id',
  sourceKey:'id_experience',
  onDelete: 'SET NULL',
  onUpdate:'CASCADE'
});
db.Category.belongsTo(db.Experience,{
  foreignKey: 'experience_id',
  targetId:'id_experience'
});

// PARTICIPATION ASSOCIATIONS
db.Athlete.hasMany(db.Participation, { foreignKey: 'athlete_id' });
db.Competition.hasMany(db.Participation, { foreignKey: 'competition_id' });
db.Category.hasMany(db.Participation, { foreignKey: 'category_id' });

db.Participation.belongsTo(db.Athlete, { foreignKey: 'athlete_id' });
db.Participation.belongsTo(db.Competition, { foreignKey: 'competition_id' });
db.Participation.belongsTo(db.Category, { foreignKey: 'category_id' });


// Group - Competition
db.Competition.hasMany(db.Group,{
  foreignKey: 'competition_id',
  sourceKey:'id_competition',
  onDelete: 'CASCADE',
  onUpdate:'CASCADE'
});
db.Group.belongsTo(db.Competition,{
  foreignKey: 'competition_id',
  sourceKey:'id_competition',
});

// Group - Category
db.Category.hasMany(db.Group,{
  foreignKey: 'category_id',
  sourceKey:'idcategory',
  onDelete: 'CASCADE',
  onUpdate:'CASCADE'
});
db.Group.belongsTo(db.Category,{
  foreignKey: 'category_id',
  sourceKey:'idcategory',
});


// CompetitionCategoryStage - Competition
db.Competition.hasMany(db.CompetitionCategoryStage,{
  foreignKey: 'competition_id',
  sourceKey:'id_competition',
  onDelete: 'CASCADE',
  onUpdate:'CASCADE'
});
db.CompetitionCategoryStage.belongsTo(db.Competition,{
  foreignKey: 'competition_id',
  sourceKey:'id_competition',
});

// CompetitionCategoryStage - Category
db.Category.hasMany(db.CompetitionCategoryStage,{
  foreignKey: 'category_id',
  sourceKey:'idcategory',
  onDelete: 'CASCADE',
  onUpdate:'CASCADE'
});
db.CompetitionCategoryStage.belongsTo(db.Category,{
  foreignKey: 'category_id',
  sourceKey:'idcategory',
});



// Round Association
db.Athlete.hasMany(db.Round, { foreignKey: 'athlete_id',
  onDelete: 'CASCADE',
  onUpdate:'CASCADE'
 });
db.Group.hasMany(db.Round, { foreignKey: 'group_id',
  onDelete: 'CASCADE',
  onUpdate:'CASCADE'
 });

db.Round.belongsTo(db.Athlete, { foreignKey: 'athlete_id' });
db.Round.belongsTo(db.Group, { foreignKey: 'group_id' });


// db.Participation.hasMany(db.Round, {
//   foreignKey: [
//     'participation_athlete_id',
//     'participation_competition_id',
//     'participation_category_id',
//   ],
// });

// db.Round.belongsTo(db.Participation, {
//   foreignKey: [
//     'participation_athlete_id',
//     'participation_competition_id',
//     'participation_category_id',
//   ],
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
