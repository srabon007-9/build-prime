const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/buildprime';

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { dbName: 'buildprime-db' }).then((mongooseInstance) => {
      console.log('MongoDB connected successfully to buildprime-db');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error('MongoDB connection error:', err.message);
  }

  return cached.conn;
};

module.exports = connectDB;
