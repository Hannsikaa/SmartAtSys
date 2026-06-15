/**
 * Validates .env without starting the server or connecting to the database.
 * Run: npm run check:env
 */
import { env, isPowerBiLinkConfigured } from '../src/config/env';

console.log('Environment check passed.\n');

console.log('Required (demo): OK');
console.log(`  PORT=${env.PORT}`);
console.log(`  FABRIC_WAREHOUSE_SERVER=${env.FABRIC_WAREHOUSE_SERVER}`);
console.log(`  FABRIC_WAREHOUSE_DATABASE=${env.FABRIC_WAREHOUSE_DATABASE}`);
console.log(`  FABRIC_WAREHOUSE_USER=${env.FABRIC_WAREHOUSE_USER}`);

console.log('\nPower BI (optional):');
if (isPowerBiLinkConfigured()) {
  console.log('  Demo link mode — open in browser');
  console.log(`  ${env.POWERBI_DASHBOARD_URL}`);
} else {
  console.log('  Not set (optional)');
}

console.log('\nNo Azure client ID required for demo.');
console.log('Next: run schema.sql + seed.sql, then: npm run test:db');
