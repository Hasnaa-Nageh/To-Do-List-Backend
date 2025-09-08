const express = require("express");
const {
  createTask,
  getAllTasks,
  getSingleTask,
  searchTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");
const { authenticateToken } = require("../middleware/authenticate.middleware");
const router = express.Router();

router.post("/", authenticateToken, createTask);
router.get("/", authenticateToken, getAllTasks);
router.get("/search", authenticateToken, searchTask);
router.get("/:id", authenticateToken, getSingleTask);
router.put("/:id", authenticateToken, updateTask);
router.delete("/:id", authenticateToken, deleteTask);
module.exports = router;
