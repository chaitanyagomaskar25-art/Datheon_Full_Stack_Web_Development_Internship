import { User } from '../models/User.js';
import { generateToken } from '../middleware/authMiddleware.js';
import { isDbConnected } from '../config/db.js';

// Fallback in-memory user store if MongoDB is offline
const memoryUsers = [];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        errorType: 'VALIDATION_ERROR',
        message: 'Please provide your full name.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        errorType: 'VALIDATION_ERROR',
        message: 'Please provide a valid email address.',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        errorType: 'VALIDATION_ERROR',
        message: 'Password must be at least 6 characters long.',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      const userExists = await User.findOne({ email: trimmedEmail });
      if (userExists) {
        return res.status(409).json({
          success: false,
          errorType: 'USER_EXISTS',
          message: 'An account with this email address already exists.',
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: trimmedEmail,
        password,
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      });
    }

    // In-memory fallback
    const exists = memoryUsers.some((u) => u.email === trimmedEmail);
    if (exists) {
      return res.status(409).json({
        success: false,
        errorType: 'USER_EXISTS',
        message: 'An account with this email address already exists.',
      });
    }

    const newUser = {
      _id: Date.now().toString(),
      name: name.trim(),
      email: trimmedEmail,
      createdAt: new Date(),
    };
    memoryUsers.push(newUser);
    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully (standalone mode).',
      token,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & return JWT token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        errorType: 'VALIDATION_ERROR',
        message: 'Please provide both email and password.',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      // Must explicitly select +password since it's set to select: false
      const user = await User.findOne({ email: trimmedEmail }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          errorType: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password. Please try again.',
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          errorType: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password. Please try again.',
        });
      }

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: 'Signed in successfully!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      });
    }

    // In-memory fallback
    const memUser = memoryUsers.find((u) => u.email === trimmedEmail);
    const dummyUser = memUser || {
      _id: 'demo_user_123',
      name: 'SkyCast Explorer',
      email: trimmedEmail,
      createdAt: new Date(),
    };
    const token = generateToken(dummyUser._id);

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully (standalone mode).',
      token,
      user: dummyUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private (Protected by JWT)
export const getUserProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (Protected by JWT)
export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (isDbConnected()) {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found.',
        });
      }

      if (name) user.name = name.trim();
      if (email) user.email = email.trim().toLowerCase();
      if (avatar !== undefined) user.avatar = avatar;
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            success: false,
            message: 'New password must be at least 6 characters long.',
          });
        }
        user.password = password; // Will be hashed by pre-save hook
      }

      const updatedUser = await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          createdAt: updatedUser.createdAt,
        },
      });
    }

    // Fallback in-memory
    const updated = {
      ...req.user,
      name: name || req.user.name,
      email: email || req.user.email,
    };

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully (in-memory mode).',
      user: updated,
    });
  } catch (error) {
    next(error);
  }
};
