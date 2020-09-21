var express = require("express");
const task_controller = require("./../controllers/task_controller");
var router = express.Router();

router.get("/tasks", task_controller.getTasks);
router.get("/task/:id", task_controller.getTaskById);
router.post("/task", task_controller.createTask);
router.patch("/task/:id", task_controller.updateTask);
router.delete("/task/:id", task_controller.deleteTask);

module.exports = router;
