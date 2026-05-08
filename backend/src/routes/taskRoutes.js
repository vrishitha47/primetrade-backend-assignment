const express = require('express');

const {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask
} = require('../controllers/taskController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createTaskValidation,
  mongoIdParamValidation,
  updateTaskValidation
} = require('../validations/taskValidation');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(createTaskValidation, validate, createTask);

router
  .route('/:id')
  .get(mongoIdParamValidation, validate, getTaskById)
  .patch(updateTaskValidation, validate, updateTask)
  .delete(mongoIdParamValidation, validate, deleteTask);

module.exports = router;
