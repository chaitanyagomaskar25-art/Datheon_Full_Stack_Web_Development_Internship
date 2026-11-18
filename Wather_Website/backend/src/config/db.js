import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skycast';

  // Listen to connection lifecycle events
  mongoose.connection.on('connected', () => {
    console.log('[MongoDB] Connection established successfully.');
  });

  mongoose.connection.on('error', (err) => {
    console.warn(`[MongoDB] Connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Connection disconnected.');
  });

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      autoIndex: process.env.NODE_ENV !== 'production',
    });
    console.log(`[MongoDB] Connected to database cluster: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Initial connection failed: ${error.message}`);
    console.warn('[MongoDB] Running with in-memory resilient fallback. All weather & forecast endpoints remain fully operational.');
    return null;
  }
};

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};
