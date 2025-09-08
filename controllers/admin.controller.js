const User = require("./../models/user.model");
const Task = require("./../models/task.model");
const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -refreshToken");

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const DeleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate("user", "username email -_id") // نخليها أخف
      .sort({ createdAt: -1 });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { getAllUser, getAllTasks, DeleteUser };
