import sql from 'mssql';
import { env } from './env';
import { logger } from '../utils/logger';

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool?.connected) {
    return pool;
  }

  try {
    pool = await new sql.ConnectionPool({
      server: env.FABRIC_WAREHOUSE_SERVER,
      database: env.FABRIC_WAREHOUSE_DATABASE,
      user: env.FABRIC_WAREHOUSE_USER,
      password: env.FABRIC_WAREHOUSE_PASSWORD,
      port: 1433,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      options: {
        encrypt: env.FABRIC_WAREHOUSE_ENCRYPT,
        trustServerCertificate: env.FABRIC_WAREHOUSE_TRUST_SERVER_CERT,
        connectTimeout: 30000,
        requestTimeout: 30000,
      },
    }).connect();

    logger.info('Connected to Fabric Warehouse');
    return pool;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Fabric Warehouse connection failed', { error: message });
    throw error;
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    logger.info('Database pool closed');
  }
}

export { sql };
