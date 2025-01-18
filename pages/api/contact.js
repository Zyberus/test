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

const logError = (error, context = {}) => {
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    ...context
  });
};

export default async function handler(req, res) {
  console.log('API Request received:', {
    method: req.method,
    url: req.url,
    headers: {
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent']
    }
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
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Only POST requests are accepted.' 
    });
  }

  // Check MongoDB URI
  if (!process.env.MONGODB_URI) {
    logError(new Error('MongoDB URI is not configured'));
    return res.status(500).json({ 
      success: false, 
      message: 'Server configuration error' 
    });
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
    console.log('Database connected successfully');

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
    logError(error, { 
      body: req.body,
      mongodbUri: process.env.MONGODB_URI ? 'configured' : 'missing'
    });

    // Determine if it's a connection error
    const isConnectionError = error.name === 'MongooseError' || 
                            error.name === 'MongoNetworkError' ||
                            error.message.includes('connect');

    res.status(isConnectionError ? 503 : 500).json({ 
      success: false, 
      message: isConnectionError 
        ? 'Unable to connect to database. Please try again later.'
        : 'Failed to send message. Please try again.',
      error: process.env.NODE_ENV === 'development' 
        ? { message: error.message, type: error.name }
        : undefined
    });
  }
}
