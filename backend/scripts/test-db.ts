/**
 * Test Fabric Warehouse connection and basic table access.
 * Run: npm run test:db
 */
import { getPool, closePool } from '../src/config/db';

async function main(): Promise<void> {
  console.log('Connecting to Fabric Warehouse (SQL auth)...\n');

  const pool = await getPool();

  const ping = await pool.request().query('SELECT 1 AS ok');
  console.log('SELECT 1:', ping.recordset[0]);

  try {
    const count = await pool.request().query('SELECT COUNT(*) AS cnt FROM Students');
    console.log('Students table rows:', count.recordset[0].cnt);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('Invalid object name')) {
      console.error('\nStudents table not found — run sql/schema.sql first.');
      console.error('See docs/DATABASE_SETUP.md');
    } else {
      throw error;
    }
  }

  await closePool();
  console.log('\nDatabase connection test passed.');
}

main().catch((err) => {
  console.error('\nDatabase connection test FAILED:');
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
