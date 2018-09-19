Promise = require('bluebird');
const { port, env } = require('./config/variables');
const app = require('./config/express');
const mongoose = require('./config/mongoose');

//open mongoose connection
mongoose.connect();

//listen to requests
app.listen(port, ()=>console.info(`Server Started on port ${port} (${env})`));


module.exports = app;