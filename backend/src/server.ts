import app from './app';
import { env, isPowerBiEmbedConfigured, isPowerBiLinkConfigured } from './config/env';
import { getPool, closePool } from './config/db';
import { logger } from './utils/logger';
import { startAttendanceRiskJob } from './jobs/attendanceRisk.job';

async function bootstrap(): Promise<void> {
  if (isPowerBiEmbedConfigured()) {
    logger.info('Power BI embed enabled (Azure credentials configured)');
  } else if (isPowerBiLinkConfigured()) {
    logger.info('Power BI link-only mode (Azure skipped — frontend opens report URL in browser)');
  } else {
    logger.info('Power BI not configured — core APIs unaffected');
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
