var express = require("express");

const status = require("../config/status").status;
const stripeController = require("../controllers/app/stripe.controller");

const { Sequelize } = require("sequelize");
const { expressUmzug, SequelizeStorage } = require("express-umzug");
const { sequelize } = require("../database/models");

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.status(status.SUCCESS_STATUS)
      .send(`${process.env.PROJECT_NAME} is ready for use.`)
  })

  app.use('/app-api', require('./app'));
  app.use('/cms-api', require('./cms'));


  // ------------------------    Umzug Config    -------------------
  app.use(expressUmzug({
    secretKey: process.env.EXPRESS_UMZUG_SECRET,
    umzugOptions: {
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      migrations: {
        // change according to your migration path
        glob: "database/migrations/*.js",
        resolve: ({ name, path, context }) => {
          const migration = require(path);
          return {
            name,
            up: async () => migration.up(context, Sequelize),
            down: async () => migration.down(context, Sequelize),
          };
        },
      },
      logger: console,
    },
  }));

};
