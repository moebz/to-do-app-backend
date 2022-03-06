const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.get("/tasks", controller.getTasks);
router.get("/task/:_id", controller.getTaskById);
router.post("/task", controller.createTask);
router.patch("/task/:_id", controller.updateTask);
router.delete("/task/:_id", controller.deleteTask);

module.exports = router;
