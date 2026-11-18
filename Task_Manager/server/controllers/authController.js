import { User } from '../models/User.js';
import { Task } from '../models/Task.js';
import { Notification } from '../models/Notification.js';
import { checkRemindersForUser } from '../services/reminderScheduler.js';
import { generateToken } from '../utils/generateToken.js';

// Helper to seed initial sample tasks for a user
export async function seedTasksForUser(userId) {
  const iso = (d) => {
    const target = new Date();
    target.setDate(target.getDate() + d);
    return target.toISOString().slice(0, 10);
  };

  const seed = [
    {
      title: 'Finalize Q4 product roadmap',
      description: 'Draft milestones for the next quarter and circulate to the team for review.',
      category: 'Work',
      priority: 'High',
      dueDate: iso(0),
      completed: false,
      order: 0,
      user: userId,
    },
    {
      title: 'Review pull requests and schema migrations',
      description: 'Three PRs waiting in the queue — focus on auth and database indexes.',
      category: 'Work',
      priority: 'Medium',
      dueDate: iso(1),
      completed: false,
      order: 1,
      user: userId,
    },
    {
      title: 'Read chapter 7 — Designing Data-Intensive Apps',
      description: 'Replication and partitioning notes for the study group.',
      category: 'Study',
      priority: 'Medium',
      dueDate: iso(3),
      completed: false,
      order: 2,
      user: userId,
    },
    {
      title: 'Morning 5km recovery run',
      description: 'Easy pace recovery run around the neighborhood park.',
      category: 'Personal',
      priority: 'Low',
      dueDate: iso(0),
      completed: false,
      order: 3,
      user: userId,
    },
    {
      title: 'Pay electricity bill',
      description: 'Submit manual payment before the end of the week.',
      category: 'Personal',
      priority: 'High',
      dueDate: iso(-2),
      completed: false,
      order: 4,
      user: userId,
    },
    {
      title: 'Prepare slides for Monday standup',
      description: 'Keep it short: sprint velocity, blockers, next milestones.',
      category: 'Work',
      priority: 'Medium',
      dueDate: null,
      completed: true,
      order: 5,
      user: userId,
    },
  ];

  const insertedTasks = await Task.insertMany(seed);

  // Seed sample completed notification and run reminders check
  try {
    const completedTask = insertedTasks.find((t) => t.completed);
    if (completedTask) {
      await Notification.create({
        user: userId,
        task: completedTask._id,
        type: 'task_completed',
        title: 'Task Completed!',
        message: `You completed "${completedTask.title}". Excellent start!`,
        read: true,
        metadata: {
          taskTitle: completedTask.title,
          dueDate: completedTask.dueDate,
          priority: completedTask.priority,
          category: completedTask.category,
        },
      });
    }

    await checkRemindersForUser(userId);
  } catch (err) {
    console.warn('[Notification Seed Warning]:', err.message);
  }
}

// Seed default demo user on startup if no users exist
export async function seedDemoUserIfEmpty() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const demoUser = await User.create({
        name: 'Alex Rivers',
        email: 'demo@tasker.pro',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
        preferences: {
          theme: 'dark',
          defaultCategory: 'Work',
          defaultPriority: 'Medium',
        },
      });

      await seedTasksForUser(demoUser._id);
      console.log('[Auth] Default demo user created: demo@tasker.pro / password123');
    }
  } catch (err) {
    console.warn('[Auth Warning] Demo user seeding skipped:', err.message);
  }
}

// Helper to set HTTP-only cookie and send JSON response
function sendTokenResponse(user, statusCode, res, message = 'Success') {
  const token = generateToken(user._id);

  // Cookie settings: httpOnly protects against XSS, lax protects against CSRF
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      preferences: user.preferences,
    },
  });
}

// @desc    Register a new user
// @route   POST /api/auth/register
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Validation
    const errors = [];
    if (!name || !name.trim()) errors.push('Name is required');
    if (!email || !email.trim()) errors.push('Email is required');
    else if (!/\S+@\S+\.\S+/.test(email.trim())) errors.push('Invalid email format');
    if (!password || password.length < 6) errors.push('Password must be at least 6 characters long');

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    // Seed introductory tasks for the new user's personal backlog
    try {
      await seedTasksForUser(user._id);
    } catch {
      // Non-fatal if seeding tasks fails
    }

    return sendTokenResponse(user, 201, res, 'Account registered successfully.');
  } catch (error) {
    next(error);
  }
}

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    return sendTokenResponse(user, 200, res, 'Logged in successfully.');
  } catch (error) {
    next(error);
  }
}

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
export async function getMe(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
export async function logout(req, res, next) {
  try {
    res.cookie('token', 'none', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 5 * 1000),
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
}
