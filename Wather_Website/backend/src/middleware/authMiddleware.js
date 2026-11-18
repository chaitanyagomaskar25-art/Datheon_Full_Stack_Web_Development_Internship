import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'skycast_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// Protect middleware: strictly requires valid JWT token
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'skycast_super_secret_jwt_key_2026'
      );

      if (isDbConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // Fallback for standalone/in-memory mode
        req.user = { _id: decoded.id, name: 'Demo User', email: 'demo@skycast.com' };
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          errorType: 'AUTH_FAILED',
          message: 'User belonging to this token no longer exists.',
        });
      }

      return next();
    } catch (error) {
      console.error('[AuthMiddleware] JWT Verification Failed:', error.message);
      return res.status(401).json({
        success: false,
        errorType: 'TOKEN_INVALID',
        message: 'Not authorized, session token failed or expired. Please sign in again.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      errorType: 'NO_TOKEN',
      message: 'Not authorized, access token missing. Please sign in.',
    });
  }
};

// Optional auth: attaches req.user if token is present, but allows guest access
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'skycast_super_secret_jwt_key_2026'
      );

      if (isDbConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = { _id: decoded.id, name: 'Demo User', email: 'demo@skycast.com' };
      }
    } catch (error) {
      // Ignore token errors in optional auth
      req.user = null;
    }
  }

  next();
};
