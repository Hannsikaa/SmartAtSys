/**
 * Validates .env without starting the server or connecting to the database.
 * Run: npm run check:env
 */
import {
  env,
  isPowerBiEmbedConfigured,
  isPowerBiLinkConfigured,
  getMissingPowerBiVars,
} from '../src/config/env';

console.log('Environment check passed.\n');

console.log('Server startup (required): OK');
console.log(`  PORT=${env.PORT}`);
console.log(`  FABRIC_WAREHOUSE_SERVER=${env.FABRIC_WAREHOUSE_SERVER}`);
console.log(`  FABRIC_WAREHOUSE_DATABASE=${env.FABRIC_WAREHOUSE_DATABASE}`);

console.log('\nPower BI:');
if (isPowerBiEmbedConfigured()) {
  console.log('  Mode: embed (Azure credentials present)');
} else if (isPowerBiLinkConfigured()) {
  console.log('  Mode: link-only (Azure skipped — open report URL in browser)');
  console.log(`  Report URL: ${env.POWERBI_DASHBOARD_URL}`);
} else {
  console.log('  Mode: disabled (optional — set POWERBI_DASHBOARD_URL for link-only mode)');
}

if (!isPowerBiEmbedConfigured()) {
  console.log('\n  Azure embed vars not set (expected for now):');
  getMissingPowerBiVars().forEach((key) => console.log(`    - ${key}`));
}

console.log('\nCore APIs (auth, attendance, analytics, AI, notifications) are ready to test.');
