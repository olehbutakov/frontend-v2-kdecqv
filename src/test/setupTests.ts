/**
 * Global test setup file
 * Custom matchers or global test utils go here
 */
import '@testing-library/jest-dom';

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Reset DOM between tests
afterEach(() => {
  document.body.innerHTML = '';
});
