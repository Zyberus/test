const mongoose = require('mongoose');

// Contact Schema
const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        trim: true,
        lowercase: true
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject'],
        maxlength: [100, 'Subject cannot be more than 100 characters'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

let Contact;
try {
    Contact = mongoose.model('Contact');
} catch {
    Contact = mongoose.model('Contact', ContactSchema);
}

// Rate limiting (in-memory)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

const checkRateLimit = (ip) => {
    const now = Date.now();
    const userRequests = rateLimit.get(ip) || [];
    const recentRequests = userRequests.filter(time => time > now - RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= MAX_REQUESTS) {
        return false;
    }
    
    recentRequests.push(now);
    rateLimit.set(ip, recentRequests);
    return true;
};

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

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Method not allowed'
            })
        };
    }

    // Rate limiting
    const clientIp = event.headers['client-ip'] || event.headers['x-forwarded-for'];
    if (!checkRateLimit(clientIp)) {
        return {
            statusCode: 429,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Too many requests. Please try again later.'
            })
        };
    }

    try {
        let body;
        try {
            body = JSON.parse(event.body);
        } catch (error) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Invalid request body'
                })
            };
        }

        // Validate input
        const validationErrors = validateInput(body);
        if (validationErrors.length > 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Validation failed',
                    errors: validationErrors
                })
            };
        }

        // Connect to MongoDB
        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        // Create contact
        const contact = await Contact.create({
            name: body.name.trim(),
            email: body.email.trim().toLowerCase(),
            subject: body.subject.trim(),
            message: body.message.trim()
        });

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Message sent successfully',
                data: {
                    id: contact._id,
                    name: contact.name,
                    email: contact.email,
                    subject: contact.subject
                }
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Failed to send message',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            })
        };
    }
};
