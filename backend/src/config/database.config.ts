import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://MM-Alkali:crisprcas9@omega.syotlcp.mongodb.net/Omega-3-Movies';

const db = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  }
};

export default db;
