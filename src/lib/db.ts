import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  try {
    // If we have an existing connection, return it
    if (global.mongoose.conn) {
      console.log('Using existing database connection');
      return global.mongoose.conn;
    }

    // If we're already connecting, wait for it
    if (global.mongoose.promise) {
      console.log('Using existing database connection promise');
      global.mongoose.conn = await global.mongoose.promise;
      return global.mongoose.conn;
    }

    // Set up connection options
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      dbName: 'contact', // Specify the database name
    };

    console.log('Connecting to MongoDB...');
    
    // Create new connection promise
    global.mongoose.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        if (mongoose.connection.db) {
          console.log('Connected to database:', mongoose.connection.db.databaseName);
          const collections = Object.keys(mongoose.connection.collections);
          console.log('Available collections:', collections);
        }
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        global.mongoose.promise = null;
        throw error;
      });

    // Wait for connection
    global.mongoose.conn = await global.mongoose.promise;
    
    // Add connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return global.mongoose.conn;
  } catch (error) {
    console.error('Database connection error:', error);
    global.mongoose.promise = null;
    throw error;
  }
}

export default connectDB;
