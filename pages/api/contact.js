import dbConnect from '../../lib/mongodb';
import Contact from '../../models/Contact';

// Simple in-memory rate limiting
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

const validateInput = (data) => {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.length > 60) {
    errors.push('Invalid name');
  }
  
  if (!data.email || typeof data.email !== 'string' || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Invalid email');
  }
  
  if (!data.subject || typeof data.subject !== 'string' || data.subject.length > 100) {
    errors.push('Invalid subject');
  }
  
  if (!data.message || typeof data.message !== 'string') {
    errors.push('Invalid message');
  }
  
  return errors;
};

const checkRateLimit = (ip) => {
  const now = Date.now();
  const userRequests = rateLimit.get(ip) || [];
  
  // Remove old requests
  const recentRequests = userRequests.filter(time => time > now - RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return true;
};

export default async function handler(req, res) {
  console.log('API Request received:', {
    method: req.method,
    body: req.body,
    headers: req.headers
  });

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ 
      success: false, 
      message: 'Too many requests. Please try again later.' 
    });
  }

  // Input validation
  const validationErrors = validateInput(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: validationErrors 
    });
  }

  try {
    console.log('Attempting database connection...');
    await dbConnect();
    console.log('Database connected, creating contact...');
    
    const contactData = {
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      subject: req.body.subject.trim(),
      message: req.body.message.trim()
    };
    
    console.log('Creating contact with data:', contactData);
    const contact = await Contact.create(contactData);
    console.log('Contact created successfully:', contact);
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject
      }
    });
  } catch (error) {
    console.error('Error in contact API:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : 'Internal server error'
    });
  }
}
