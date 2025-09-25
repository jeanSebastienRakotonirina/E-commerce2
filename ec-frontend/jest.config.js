export const testEnvironment = 'jsdom';
export const setupFilesAfterEnv = ['<rootDir>/src/setupTests.js'];
export const moduleNameMapper = {
    '\\.(css|less)$': 'identity-obj-proxy',
};
export const transform = {
    '^.+\\.(js|jsx)$': 'babel-jest',
};