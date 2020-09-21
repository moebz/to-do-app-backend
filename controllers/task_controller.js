const models = require("../models");

const getTasks = async (req, res) => {
  try {
    const tasks = await models.task.findAll({
      order: [
        ['created_at', 'DESC'],
      ],
    });
    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await models.task.findByPk(req.params.id);
    return res.status(200).json({
      task,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  console.log('createTask.req.body', req.body);
  try {
    const task = await models.task.create({content: req.body.content});
    return res.status(201).json({
      task,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  console.log(req.params.id);
  try {
    const task = await models.task.findByPk(req.params.id);
    if (task === null) {
      return res.status(404);
    }
    task.content = req.body.content;
    task.save();
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await models.task.findByPk(req.params.id);
    if (task === null) {
      return res.status(404);
    }
    task.destroy();
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
