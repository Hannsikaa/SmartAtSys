import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      JWT_SECRET: 'test-secret-key-min-8-chars',
      FABRIC_WAREHOUSE_SERVER: 'localhost',
      FABRIC_WAREHOUSE_DATABASE: 'test',
      FABRIC_WAREHOUSE_USER: 'test',
      FABRIC_WAREHOUSE_PASSWORD: 'test',
    },
  },
});
