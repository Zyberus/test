import mongoose from 'mongoose';

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

// Delete the model if it exists to prevent OverwriteModelError
mongoose.models = {};

const Contact = mongoose.model('Contact', ContactSchema);

export default Contact;
