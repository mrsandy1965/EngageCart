export default {
    testEnvironment: 'node',
    transform: {},
    testMatch: [
        '**/tests/**/*.test.js',
        '**/tests/integration/**/*.test.js',
    ],
    testTimeout: 30000,       // allow extra time for MongoMemoryServer startup
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/index.js',
    ],
};
