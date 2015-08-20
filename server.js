var express    = require('express');
var bodyParser = require('body-parser');
var Sequelize  = require('sequelize');
var http       = require('http');
var epilogue   = require('epilogue');
var sequelize  = new Sequelize('development', null, null, {
  logging: console.log,
  dialect: 'sqlite',
  storage: './db.development.sqlite'
});

var app        = express();
var port = process.env.PORT || 3000;


// parse application/json
app.use(bodyParser.json());

/*
 * Models DEFINITIONS
 */

// Card model
var Card = sequelize.define('cards', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  color: Sequelize.STRING,
  status: Sequelize.STRING
});

// Task model
var Task = sequelize.define('tasks', {
  name: Sequelize.STRING,
  done: Sequelize.BOOLEAN
});

// Relationship definition
Card.hasMany(Task);

/*
 * Epilogue configurations
 */

// Initialize epilogue
epilogue.initialize({
  app: app,
  sequelize: sequelize
});

// Create REST resource
var cardResource = epilogue.resource({
  model: Card,
  endpoints: ['/cards', '/cards/:id'],
  associations: true,
  sort: {
    default: '-updatedAt'
  }
});

/*
 * Launch the server
 */
app.listen(port);
console.log('Kanban API server is listening on port ' + port);
