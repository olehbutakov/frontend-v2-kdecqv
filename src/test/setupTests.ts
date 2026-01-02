/**
 * Global test setup file
 * Custom matchers or global test utils go here
 */
import '@testing-library/jest-dom';

// Supress console output in tests
globalThis.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Reset DOM between tests
afterEach(() => {
  document.body.innerHTML = '';
});
