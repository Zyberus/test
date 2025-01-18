import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    try {
        if (cached.conn) {
            console.log('Using cached database connection');
            return cached.conn;
        }

        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            };

            console.log('Connecting to MongoDB...');
            cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
                .then((mongoose) => {
                    console.log('Successfully connected to MongoDB.');
                    mongoose.connection.on('error', (err) => {
                        console.error('MongoDB connection error:', err);
                    });
                    return mongoose;
                })
                .catch((error) => {
                    console.error('Failed to connect to MongoDB:', error);
                    throw error;
                });
        }
        
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

export default dbConnect;
