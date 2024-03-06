//DB CONNECTION
global.sequelize = require('./database').sequelize
global.Op = sequelize.Op