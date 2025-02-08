import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      // During build time, we don't need a real connection
      if (process.env.NODE_ENV === 'production' && process.env.NETLIFY) {
        console.log('Skipping MongoDB connection during build');
        return;
      }
      throw new Error('MONGODB_URI is not defined');
    }

    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;
