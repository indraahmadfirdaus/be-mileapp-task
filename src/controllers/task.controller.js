const Task = require('../models/Task');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// @route   GET /api/tasks
// @desc    Get all tasks with filtering, sorting, and pagination
// @access  Private
exports.getAllTasks = (req, res) => {
  try {
    const { status, priority, search, sortBy, order, page, limit } = req.query;

    const filters = {
      userId: req.user.id
    };
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (search) filters.search = search;

    const sort = {};
    if (sortBy) {
      sort.field = sortBy;
      sort.order = order || 'asc';
    }

    const pagination = {
      page: page || 1,
      limit: limit || 10
    };

    const result = Task.getAll(filters, sort, pagination);

    return paginatedResponse(
      res,
      'Tasks retrieved successfully',
      result.data,
      result.meta,
      200
    );

  } catch (error) {
    console.error('Get tasks error:', error);
    return errorResponse(res, 'Server error while fetching tasks', 500);
  }
};

// @route   GET /api/tasks/:id
// @desc    Get single task by ID
// @access  Private
exports.getTaskById = (req, res) => {
  try {
    const task = Task.getById(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    if (task.userId !== req.user.id) {
      return errorResponse(res, 'Not authorized to access this task', 403);
    }

    return successResponse(res, 'Task retrieved successfully', task, 200);

  } catch (error) {
    console.error('Get task error:', error);
    return errorResponse(res, 'Server error while fetching task', 500);
  }
};

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
exports.createTask = (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return errorResponse(res, 'Title is required', 400);
    }

    const taskData = {
      title,
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      userId: req.user.id
    };

    const newTask = Task.create(taskData);

    return successResponse(res, 'Task created successfully', newTask, 201);

  } catch (error) {
    console.error('Create task error:', error);
    return errorResponse(res, 'Server error while creating task', 500);
  }
};

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
exports.updateTask = (req, res) => {
  try {
    const task = Task.getById(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    if (task.userId !== req.user.id) {
      return errorResponse(res, 'Not authorized to update this task', 403);
    }

    const { title, description, status, priority, dueDate } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const updatedTask = Task.update(req.params.id, updateData);

    return successResponse(res, 'Task updated successfully', updatedTask, 200);

  } catch (error) {
    console.error('Update task error:', error);
    return errorResponse(res, 'Server error while updating task', 500);
  }
};

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
exports.deleteTask = (req, res) => {
  try {
    const task = Task.getById(req.params.id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    if (task.userId !== req.user.id) {
      return errorResponse(res, 'Not authorized to delete this task', 403);
    }

    const deleted = Task.delete(req.params.id);

    if (!deleted) {
      return errorResponse(res, 'Failed to delete task', 500);
    }

    return successResponse(res, 'Task deleted successfully', null, 200);

  } catch (error) {
    console.error('Delete task error:', error);
    return errorResponse(res, 'Server error while deleting task', 500);
  }
};

// @route   GET /api/tasks/stats
// @desc    Get task statistics
// @access  Private
exports.getTaskStats = (req, res) => {
  try {
    const stats = Task.getStats(req.user.id);
    return successResponse(res, 'Statistics retrieved successfully', stats, 200);
  } catch (error) {
    console.error('Get stats error:', error);
    return errorResponse(res, 'Server error while fetching statistics', 500);
  }
};