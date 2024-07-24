const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('DID', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Groups = require('./models/group')(sequelize, Sequelize);
db.Users = require('./models/user')(sequelize, Sequelize);
db.Devices = require('./models/device')(sequelize, Sequelize);
db.Layouts = require('./models/layout')(sequelize, Sequelize);
db.Contents = require('./models/content')(sequelize, Sequelize);
db.MunicipalLogos = require('./models/municipallogo')(sequelize, Sequelize);
db.EmergencyMessages = require('./models/emergencymessage')(sequelize, Sequelize);
db.ContentSettings = require('./models/contentsetting')(sequelize, Sequelize);
db.TextSettings = require('./models/textsetting')(sequelize, Sequelize);
db.ContentPeriods = require('./models/contentperiod')(sequelize, Sequelize);
db.LayoutApplications = require('./models/layoutapplication')(sequelize, Sequelize);
db.Schedules = require('./models/schedule')(sequelize, Sequelize);
db.Logs = require('./models/log')(sequelize, Sequelize); // Logs 모델 추가

// Define associations
db.Users.belongsTo(db.Groups, { foreignKey: 'group_id' });
db.Devices.belongsTo(db.Groups, { foreignKey: 'group_name', targetKey: 'group_name' });
db.Layouts.belongsTo(db.Groups, { foreignKey: 'group_id' });
db.ContentSettings.belongsTo(db.Contents, { foreignKey: 'content_id' });
db.TextSettings.belongsTo(db.Contents, { foreignKey: 'content_id' });
db.ContentPeriods.belongsTo(db.Contents, { foreignKey: 'content_id' });
db.EmergencyMessages.belongsTo(db.Layouts, { foreignKey: 'layout_id' });
db.LayoutApplications.belongsTo(db.Layouts, { foreignKey: 'layout_id' });
db.LayoutApplications.belongsTo(db.Devices, { foreignKey: 'device_id' });

module.exports = db;
