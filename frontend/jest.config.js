export default {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/src/__tests__/__mocks__/styleMock.js',
        '\\.(jpg|jpeg|png|gif|svg|ico|webp)$': '<rootDir>/src/__tests__/__mocks__/fileMock.js',
    },
    // Exclude the __mocks__ folder from being treated as test suites
    testPathIgnorePatterns: [
        '/node_modules/',
        '/src/__tests__/__mocks__/',
    ],
    setupFilesAfterEachTest: ['@testing-library/jest-dom'],
    testMatch: ['**/__tests__/**/*.{test,spec}.{js,jsx}', '**/*.test.{js,jsx}'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/main.jsx',
        '!src/__tests__/**',
    ],
    coverageReporters: ['text', 'lcov'],
};
