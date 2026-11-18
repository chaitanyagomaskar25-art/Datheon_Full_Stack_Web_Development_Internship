import { SearchHistory } from '../models/SearchHistory.js';
import { isDbConnected } from '../config/db.js';

let memoryHistory = [];

// @desc    Get recent search history for user
// @route   GET /api/history
// @access  Public / Private
export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (isDbConnected()) {
      const query = userId ? { user: userId } : {};
      const history = await SearchHistory.find(query).sort({ createdAt: -1 }).limit(10);
      return res.status(200).json({
        success: true,
        count: history.length,
        data: history,
      });
    }

    const filtered = userId
      ? memoryHistory.filter((h) => h.user === userId.toString())
      : memoryHistory;

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
      notice: 'Served from in-memory fallback.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear search history
// @route   DELETE /api/history
// @access  Public / Private
export const clearHistory = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (isDbConnected()) {
      const query = userId ? { user: userId } : {};
      await SearchHistory.deleteMany(query);
      return res.status(200).json({
        success: true,
        message: 'Search history cleared successfully.',
      });
    }

    if (userId) {
      memoryHistory = memoryHistory.filter((h) => h.user !== userId.toString());
    } else {
      memoryHistory = [];
    }

    return res.status(200).json({
      success: true,
      message: 'Search history cleared.',
    });
  } catch (error) {
    next(error);
  }
};
