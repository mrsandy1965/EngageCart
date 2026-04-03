/**
 * dbHelper.js
 * Manages an in-memory MongoDB instance for integration tests.
 * Uses mongodb-memory-server so no real DB connection is needed.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

/**
 * Start in-memory MongoDB and connect Mongoose to it.
 */
export async function connectTestDB() {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
}

/**
 * Drop all collections between tests to keep state clean.
 */
export async function clearTestDB() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
}

/**
 * Disconnect Mongoose and stop the in-memory server after all tests.
 */
export async function closeTestDB() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }

    if (mongod && typeof mongod.stop === 'function') {
        try {
            await mongod.stop();
        } catch (_err) {
            // Ignore shutdown errors in test teardown to avoid masking test results.
        }
    }
}
