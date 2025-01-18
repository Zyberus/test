import { NextResponse } from 'next/server';
import { verifyToken } from '../utils/auth';

export function adminAuth(handler) {
  return async (req, res) => {
    try {
      const token = req.cookies.adminToken;

      if (!token || !verifyToken(token)) {
        if (req.url === '/api/admin/login') {
          return handler(req, res);
        }
        return res.status(401).json({ error: 'Unauthorized' });
      }

      return handler(req, res);
    } catch (error) {
      console.error('Admin auth error:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
}
