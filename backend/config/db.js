// EN: Connect Mongoose to MongoDB, falling back to an in-memory database/store outside production; SI: Mongoose MongoDB වෙත සම්බන්ධ කර production නොවන විට memory fallback භාවිත කරයි.
const mongoose = require('mongoose');

const connectDB = async () => {
  // EN: Accept either supported environment-variable name for the MongoDB URI; SI: MongoDB URI සඳහා පිළිගත් environment variable දෙකෙන් එකක් භාවිත කරයි.
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  try {
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined!');
    }

    // EN: Allow extra time for remote database selection; SI: දුරස්ථ database එක තෝරාගැනීමට අමතර කාලයක් ලබා දෙයි.
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    global.IS_IN_MEMORY_MODE = false;
  } catch (error) {
    console.warn(`[Database] MongoDB Connection Error: ${error.message}`);

    // EN: Use MongoMemoryServer for non-production local development when MongoDB is unavailable; SI: MongoDB නොමැති non-production සංවර්ධනයේදී MongoMemoryServer භාවිත කරයි.
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
        // EN: Signal controllers to use the plain JavaScript store if the memory server also fails; SI: memory server එකත් අසාර්ථක නම් controllers වෙත JavaScript store භාවිතයට දන්වයි.
        console.warn(`[Database] In-Memory Engine Fallback: Using JS store (${memErr.message})`);
        global.IS_IN_MEMORY_MODE = true;
      }
    } else {
      // EN: Production does not start an ephemeral database; mark the JS-store fallback instead; SI: production හි තාවකාලික database එකක් නොඅරඹා JS-store fallback සලකුණු කරයි.
      global.IS_IN_MEMORY_MODE = true;
    }
  }
};

module.exports = connectDB;