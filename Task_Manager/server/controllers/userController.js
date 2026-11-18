import { User } from '../models/User.js';

// @desc    Get current authenticated user profile
// @route   GET /api/users/me
export async function getCurrentUser(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Update user preferences
// @route   PUT /api/users/preferences
export async function updateUserPreferences(req, res, next) {
  try {
    const { theme, defaultCategory, defaultPriority, name } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name.trim();
    if (theme && ['light', 'dark', 'system'].includes(theme)) {
      user.preferences.theme = theme;
    }
    if (defaultCategory && ['Work', 'Personal', 'Study', 'Other'].includes(defaultCategory)) {
      user.preferences.defaultCategory = defaultCategory;
    }
    if (defaultPriority && ['Low', 'Medium', 'High'].includes(defaultPriority)) {
      user.preferences.defaultPriority = defaultPriority;
    }

    const updated = await user.save();

    res.status(200).json({
      success: true,
      message: 'User preferences updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}
