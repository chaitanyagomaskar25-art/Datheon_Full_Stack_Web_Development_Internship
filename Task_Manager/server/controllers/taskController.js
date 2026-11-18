import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { Notification } from '../models/Notification.js';
import { checkRemindersForUser } from '../services/reminderScheduler.js';

// @desc    Get all tasks for the authenticated user with optional search, filters & sort
// @route   GET /api/tasks
export async function getTasks(req, res, next) {
  try {
    const { search, category, priority, status, sort } = req.query;

    // Strict user isolation filter
    const filter = { user: req.user._id };

    if (search && search.trim()) {
      const q = search.trim();
      filter.$and = [
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
          ],
        },
      ];
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    if (status === 'active') {
      filter.completed = false;
    } else if (status === 'completed') {
      filter.completed = true;
    }

    let sortOption = { order: 1, createdAt: -1 };
    if (sort === 'recent') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'dueDate') {
      sortOption = { dueDate: 1, createdAt: -1 };
    }

    let tasks = await Task.find(filter).sort(sortOption);

    if (sort === 'priority') {
      const rank = { High: 0, Medium: 1, Low: 2 };
      tasks = tasks.sort((a, b) => (rank[a.priority] ?? 1) - (rank[b.priority] ?? 1));
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single task by ID (only if belonging to user)
// @route   GET /api/tasks/:id
export async function getTaskById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task identifier format.',
      });
    }

    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found or you are not authorized to view it.`,
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Create a new task for the authenticated user
// @route   POST /api/tasks
export async function createTask(req, res, next) {
  try {
    const { title, description, category, priority, dueDate, order } = req.body;

    // Get lowest order number for this user to prepend at the top
    let taskOrder = order;
    if (taskOrder === undefined) {
      const topTask = await Task.findOne({ user: req.user._id }).sort({ order: 1 });
      taskOrder = topTask ? Math.min(0, topTask.order - 1) : 0;
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'Work',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      completed: false,
      order: taskOrder,
      user: req.user._id,
    });

    if (task.dueDate) {
      checkRemindersForUser(req.user._id).catch(() => {});
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Update an existing task (only if belonging to user)
// @route   PUT /api/tasks/:id
export async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, category, priority, dueDate, completed, order } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task identifier format.',
      });
    }

    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found or you are not authorized to update it.`,
      });
    }

    const wasCompleted = task.completed;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description ? description.trim() : '';
    if (category !== undefined) task.category = category;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (completed !== undefined) task.completed = Boolean(completed);
    if (order !== undefined) task.order = Number(order);

    const updatedTask = await task.save();

    // Generate task completion notification if newly completed
    if (!wasCompleted && updatedTask.completed) {
      Notification.create({
        user: req.user._id,
        task: updatedTask._id,
        type: 'task_completed',
        title: 'Task Completed!',
        message: `You completed "${updatedTask.title}". Excellent progress!`,
        metadata: {
          taskTitle: updatedTask.title,
          dueDate: updatedTask.dueDate,
          priority: updatedTask.priority,
          category: updatedTask.category,
        },
      }).catch(() => {});
    }

    if (dueDate !== undefined) {
      checkRemindersForUser(req.user._id).catch(() => {});
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Toggle task completion status (only if belonging to user)
// @route   PATCH /api/tasks/:id/toggle
export async function toggleTask(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task identifier format.',
      });
    }

    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found or you are not authorized to update it.`,
      });
    }

    task.completed = !task.completed;
    const updated = await task.save();

    // Generate completion notification if toggled to completed
    if (updated.completed) {
      Notification.create({
        user: req.user._id,
        task: updated._id,
        type: 'task_completed',
        title: 'Task Completed!',
        message: `You marked "${updated.title}" as completed. Great momentum!`,
        metadata: {
          taskTitle: updated.title,
          dueDate: updated.dueDate,
          priority: updated.priority,
          category: updated.category,
        },
      }).catch(() => {});
    }

    res.status(200).json({
      success: true,
      message: updated.completed ? 'Task marked as completed.' : 'Task reopened as active.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete a task (only if belonging to user)
// @route   DELETE /api/tasks/:id
export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task identifier format.',
      });
    }

    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found or you are not authorized to delete it.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Reorder tasks for the authenticated user
// @route   POST /api/tasks/reorder
export async function reorderTasks(req, res, next) {
  try {
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'taskIds must be an array of IDs.',
      });
    }

    // Filter to valid ObjectIds and execute bulk update strictly scoped to current user
    const validIds = taskIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

    const bulkOps = validIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, user: req.user._id },
        update: { $set: { order: index } },
      },
    }));

    if (bulkOps.length > 0) {
      await Task.bulkWrite(bulkOps);
    }

    res.status(200).json({
      success: true,
      message: 'Task order updated successfully.',
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Clear all tasks belonging to the authenticated user
// @route   DELETE /api/tasks
export async function clearAllTasks(req, res, next) {
  try {
    const result = await Task.deleteMany({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: 'All your tasks deleted successfully.',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
}
