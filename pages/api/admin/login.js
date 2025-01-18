import { sign } from 'jsonwebtoken';
import cookie from 'cookie';

const ADMIN_USERNAME = 'therayankhan73';
const ADMIN_PASSWORD = '2511867251Rk*';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET || 'fallback-secret-key-123',
    { expiresIn: '1d' }
  );

  // Set cookie
  res.setHeader('Set-Cookie', cookie.serialize('adminToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400, // 1 day
    path: '/',
  }));

  // Send success response
  res.status(200).json({ success: true });
}
