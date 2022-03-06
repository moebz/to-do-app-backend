const mongoose = require('mongoose');

const {
  log,
} = require('./utils');

const DB_URI = process.env.DB_URI || 'localhost';
const DB_USER = process.env.DB_USER || 'user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'secret';

const uri = `mongodb+srv://${DB_USER}:${encodeURIComponent(
  DB_PASSWORD,
)}@${DB_URI}`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false,
};

let connection;
const connect = async (callback) => {
  log('mongoose.connect.uri', uri, 'options', options);
  try {
    connection = await mongoose.createConnection(uri, options);

    // callback para llamar app.listen
    // cuando se ejecuta el proyecto con index-dev.js
    if (callback) {
      callback();
    }
    return connection;
  } catch (e) {
    log(`Server error on start: ${e.stack}`);
    throw e;
  }
};

function getConnection() {
  return connection;
}

module.exports = { connect, getConnection };
