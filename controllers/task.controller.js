const Task = require("./../models/task.model");

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }
    const exist = await Task.findOne({ title, user: req.user.id });
    if (exist) {
      return res
        .status(409)
        .json({ success: false, message: "Task already exists" });
    }
    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      user: req.user.id,
    });
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    if (!tasks.length) {
      return res
        .status(404)
        .json({ success: false, message: "No tasks found" });
    }
    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getSingleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: req.user.id });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      data: task,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const searchTask = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }
    const tasks = await Task.find({
      user: req.user.id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json({
      success: true,
      message: tasks.length ? "Tasks found" : "No tasks matched your query",
      data: tasks,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getSingleTask,
  searchTask,
  updateTask,
  deleteTask,
};
