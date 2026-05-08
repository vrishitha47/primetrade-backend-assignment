const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const allowedTaskFields = ['title', 'description', 'status', 'priority', 'dueDate'];

const pickTaskFields = (payload) => {
  return allowedTaskFields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      result[field] = field === 'dueDate' && payload[field] === '' ? null : payload[field];
    }

    return result;
  }, {});
};

const getOwnerId = (task) => {
  return task.owner?._id ? task.owner._id.toString() : task.owner.toString();
};

const canAccessTask = (user, task) => {
  return user.role === 'admin' || getOwnerId(task) === user._id.toString();
};

const getTasks = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { owner: req.user._id };
  const tasks = await Task.find(filter)
    .populate('owner', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks
  });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...pickTaskFields(req.body),
    owner: req.user._id
  });

  const populatedTask = await task.populate('owner', 'name email role');

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    task: populatedTask
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('owner', 'name email role');

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (!canAccessTask(req.user, task)) {
    throw new ApiError(403, 'You can only access your own tasks');
  }

  res.status(200).json({
    success: true,
    task
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (!canAccessTask(req.user, task)) {
    throw new ApiError(403, 'You can only update your own tasks');
  }

  Object.assign(task, pickTaskFields(req.body));
  await task.save();

  const populatedTask = await task.populate('owner', 'name email role');

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    task: populatedTask
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (!canAccessTask(req.user, task)) {
    throw new ApiError(403, 'You can only delete your own tasks');
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
};
