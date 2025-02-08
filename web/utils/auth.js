import { verify, sign } from 'jsonwebtoken';

export function verifyToken(token) {
  try {
    return verify(token, process.env.JWT_SECRET || 'fallback-secret-key-123');
  } catch (error) {
    return null;
  }
}

export function generateToken(payload) {
  return sign(payload, process.env.JWT_SECRET || 'fallback-secret-key-123', {
    expiresIn: '1d',
  });
}

export function isAuthenticated(req) {
  const token = req.cookies.adminToken;
  return token && verifyToken(token);
}
