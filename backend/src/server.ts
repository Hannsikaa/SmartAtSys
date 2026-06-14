import app from './app';
import { env, isPowerBiLinkConfigured } from './config/env';
import { getPool, closePool } from './config/db';
import { logger } from './utils/logger';
import { startAttendanceRiskJob } from './jobs/attendanceRisk.job';

async function bootstrap(): Promise<void> {
  if (isPowerBiLinkConfigured()) {
    logger.info('Power BI demo mode: link-only (open report URL in browser)');
  }

  await getPool();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`, { env: env.NODE_ENV });
  });

  startAttendanceRiskJob();

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Failed to start server', { error: err.message });
  process.exit(1);
});
