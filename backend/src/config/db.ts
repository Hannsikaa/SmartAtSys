import sql from 'mssql';
import { env } from './env';
import { logger } from '../utils/logger';

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool?.connected) {
    return pool;
  }

  pool = await new sql.ConnectionPool({
    server: env.FABRIC_WAREHOUSE_SERVER,
    database: env.FABRIC_WAREHOUSE_DATABASE,
    user: env.FABRIC_WAREHOUSE_USER,
    password: env.FABRIC_WAREHOUSE_PASSWORD,
    options: {
      encrypt: env.FABRIC_WAREHOUSE_ENCRYPT,
      trustServerCertificate: env.FABRIC_WAREHOUSE_TRUST_SERVER_CERT,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  }).connect();

  logger.info('Connected to Fabric Warehouse');
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    logger.info('Database pool closed');
  }
}

export { sql };
