import jwt from 'jsonwebtoken';

export function generateToken(id) {
  const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_tasker_saas';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id }, secret, {
    expiresIn,
  });
}
