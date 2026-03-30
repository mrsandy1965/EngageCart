import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { captureBackendError } from './errorTracking.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB connected');
  } catch (err) {
    captureBackendError(err, { component: 'database', action: 'connect' });
    logger.error({ error: err.message }, 'MongoDB connection failed');
    process.exit(1);
  }
};

export default connectDB;
