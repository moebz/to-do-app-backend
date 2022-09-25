const mongoose = require('mongoose');
const { getConnection } = require('./common/mongoose');

const conn = getConnection();

const TaskSchema = new mongoose.Schema({
  content: String,
  createdAt: Date,
  updatedAt: Date,
});

const TaskMgModel = conn.model(
  'task',
  TaskSchema,
  'task'
);

module.exports = {
  TaskMgModel,
};
