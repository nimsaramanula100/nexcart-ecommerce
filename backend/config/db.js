const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  try {
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined!');
    }

    // Timeout එක තත්පර 10 දක්වා වැඩි කරා, Cloud connection එකට වෙලාව දෙන්න
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    global.IS_IN_MEMORY_MODE = false;
  } catch (error) {
    console.warn(`[Database] MongoDB Connection Error: ${error.message}`);

    // Cloud එකේ නැතුව Local Develop කරනවා නම් විතරක් In-Memory Fallback එක වැඩ කරන්න:
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[Database] Initializing In-Memory MongoDB Engine...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();
        await mongoose.connect(memoryUri);
        console.log(`[Database] In-Memory MongoDB Engine Connected Successfully.`);
        global.IS_IN_MEMORY_MODE = false;
      } catch (memErr) {
        console.warn(`[Database] In-Memory Engine Fallback: Using JS store (${memErr.message})`);
        global.IS_IN_MEMORY_MODE = true;
      }
    } else {
      global.IS_IN_MEMORY_MODE = true;
    }
  }
};

module.exports = connectDB;