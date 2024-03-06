require('dotenv').config();
const Sequelize = require('sequelize')
const DB_CREDENTIAL = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_CONNECTION,
  // dialectOptions: {
  //     options: {
  //         encrypt: true,
  //     },
  // },
  pool: {
    max: 500,
    min: 0,
    acquire: 30000,
    idle: 10,
  },
}

sequelize = new Sequelize({
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  ...DB_CREDENTIAL,
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to database :)\n')
  })
  .catch(err => {
    console.log('TCL: err', err)
    console.error('Unable to connect to the database :(\n')
  })

module.exports = {
  development: DB_CREDENTIAL,
  production: DB_CREDENTIAL,
  sequelize
};