import cron from 'node-cron';
import { logger } from '../utils/logger';
import { processAllRiskNotifications } from '../services/notification.service';

export function startAttendanceRiskJob(): void {
  cron.schedule('0 2 * * *', async () => {
    logger.info('Running nightly attendance risk job');
    try {
      const created = await processAllRiskNotifications();
      logger.info('Attendance risk job completed', { notificationsCreated: created });
    } catch (error) {
      logger.error('Attendance risk job failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  logger.info('Attendance risk cron job scheduled (daily at 2:00 AM)');
}
