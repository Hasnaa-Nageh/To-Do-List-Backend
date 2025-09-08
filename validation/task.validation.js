const Joi = require("joi");

const createTaskValidation = Joi.object({
  title: Joi.string().min(3).required().messages({
    "string.empty": "Task title is required",
    "string.min": "Task title must be at least 3 characters",
  }),
  description: Joi.string().allow(""),
  status: Joi.string().valid("pending", "in-progress", "completed"),
  dueDate: Joi.date().optional(),
});

const updateTaskValidation = Joi.object({
  title: Joi.string().min(3),
  description: Joi.string().allow(""),
  status: Joi.string().valid("pending", "in-progress", "completed"),
  dueDate: Joi.date().optional(),
});

module.exports = {
  createTaskValidation,
  updateTaskValidation,
};
