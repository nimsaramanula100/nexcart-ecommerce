const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexcart';
  try {
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1500 });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    global.IS_IN_MEMORY_MODE = false;
  } catch (error) {
    console.warn(`[Database] MongoDB offline (${error.message}). Running in instant In-Memory Mode.`);
    global.IS_IN_MEMORY_MODE = true;
  }
};

module.exports = connectDB;
