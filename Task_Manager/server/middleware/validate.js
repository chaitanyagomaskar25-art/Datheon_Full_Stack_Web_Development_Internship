import mongoose from 'mongoose';

export function validateCreateTask(req, res, next) {
  const { title, category, priority, dueDate, description } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: ['Task title is required and cannot be empty.'],
    });
  }

  if (title.trim().length > 150) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: ['Task title cannot exceed 150 characters.'],
    });
  }

  if (description && typeof description === 'string' && description.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: ['Description cannot exceed 1000 characters.'],
    });
  }

  if (category && !['Work', 'Personal', 'Study', 'Other'].includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: [`Category '${category}' is invalid. Allowed: Work, Personal, Study, Other`],
    });
  }

  if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: [`Priority '${priority}' is invalid. Allowed: Low, Medium, High`],
    });
  }

  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: ['Due date must be in YYYY-MM-DD format.'],
    });
  }

  next();
}

export function validateUpdateTask(req, res, next) {
  const { title, category, priority, dueDate, description } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: ['Task title cannot be empty.'],
      });
    }
    if (title.trim().length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: ['Task title cannot exceed 150 characters.'],
      });
    }
  }

  if (description !== undefined && description !== null) {
    if (typeof description === 'string' && description.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: ['Description cannot exceed 1000 characters.'],
      });
    }
  }

  if (category !== undefined && !['Work', 'Personal', 'Study', 'Other'].includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: [`Category '${category}' is invalid. Allowed: Work, Personal, Study, Other`],
    });
  }

  if (priority !== undefined && !['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: [`Priority '${priority}' is invalid. Allowed: Low, Medium, High`],
    });
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: ['Due date must be in YYYY-MM-DD format.'],
    });
  }

  next();
}

export function validateTaskId(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Task ID is required.',
    });
  }
  // If it's a 24-char hex string, validate as ObjectId, or accept string ID
  if (mongoose.Types.ObjectId.isValid(id)) {
    return next();
  }
  // Also accept custom ID format
  if (typeof id === 'string' && id.trim().length > 0) {
    return next();
  }
  return res.status(400).json({
    success: false,
    message: 'Invalid task ID format.',
  });
}
