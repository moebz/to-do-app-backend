const mongoose = require("mongoose");
const { TaskMgModel } = require("./schema");
const utils = require("./common/utils");

const getTasks = async (req, res) => {
  try {
    await utils.sleep(4000);
    const sort = {
      date: "descending",
    };
    const tasks = await TaskMgModel.find().sort(sort).exec();
    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await TaskMgModel.findOne({
      _id: mongoose.Types.ObjectId(req.params._id),
    });
    return res.status(200).json({
      task,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  console.log("createTask.req.body", req.body);
  try {
    // throw new Error('Error de prueba');
    const task = new TaskMgModel({ content: req.body.content, createdAt: new Date() });

    await task.save();

    return res.status(201).json({
      task,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  console.log("updateTask", req.params._id);
  try {
    const task = await TaskMgModel.findOne({
      _id: new mongoose.Types.ObjectId(req.params._id)
    });
    if (!task) {
      return res.status(404);
    }
    task.content = req.body.content;
    task.updatedAt = new Date();
    task.save();
    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await TaskMgModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(req.params._id)
    });
    if (!task) {
      return res.status(404);
    }
    return res.status(200).json();
  } catch (error) {
    console.log(error);
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
