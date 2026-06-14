import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_FOR_STARTUP = [
  'JWT_SECRET (you — min 8 characters)',
  'FABRIC_WAREHOUSE_SERVER (DB / Fabric team)',
  'FABRIC_WAREHOUSE_DATABASE (DB / Fabric team)',
  'FABRIC_WAREHOUSE_USER (DB / Fabric team)',
  'FABRIC_WAREHOUSE_PASSWORD (DB / Fabric team)',
] as const;

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  JWT_SECRET: z.string().min(8),
  JWT_EXPIRES_IN: z.string().default('8h'),

  FABRIC_WAREHOUSE_SERVER: z.string().min(1),
  FABRIC_WAREHOUSE_DATABASE: z.string().min(1),
  FABRIC_WAREHOUSE_USER: z.string().min(1),
  FABRIC_WAREHOUSE_PASSWORD: z.string().min(1),
  FABRIC_WAREHOUSE_ENCRYPT: z
    .string()
    .transform((v) => v === 'true')
    .default('true'),
  FABRIC_WAREHOUSE_TRUST_SERVER_CERT: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  FABRIC_WORKSPACE_ID: z.string().optional(),

  POWERBI_DASHBOARD_URL: z.string().url().optional(),
  POWERBI_EMBED_URL: z.string().url().default('https://app.powerbi.com/reportEmbed'),
  POWERBI_WORKSPACE_ID: z.string().optional(),
  POWERBI_REPORT_ID: z.string().optional(),
  POWERBI_CLIENT_ID: z.string().optional(),
  POWERBI_CLIENT_SECRET: z.string().optional(),
  POWERBI_TENANT_ID: z.string().optional(),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  ADMIN_FACULTY_IDS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid or missing environment variables.');
  console.error('Required for server startup:');
  REQUIRED_FOR_STARTUP.forEach((item) => console.error(`  - ${item}`));
  console.error('\nValidation errors:', parsed.error.flatten().fieldErrors);
  console.error('\nSee docs/ENV.md and copy .env.example to .env');
  process.exit(1);
}

export const env = parsed.data;

export function isPowerBiEmbedConfigured(): boolean {
  return Boolean(
    env.POWERBI_WORKSPACE_ID &&
      env.POWERBI_REPORT_ID &&
      env.POWERBI_CLIENT_ID &&
      env.POWERBI_CLIENT_SECRET &&
      env.POWERBI_TENANT_ID
  );
}

export function isPowerBiLinkConfigured(): boolean {
  return Boolean(env.POWERBI_DASHBOARD_URL);
}

export function getMissingPowerBiVars(): string[] {
  const keys = [
    'POWERBI_WORKSPACE_ID',
    'POWERBI_REPORT_ID',
    'POWERBI_CLIENT_ID',
    'POWERBI_CLIENT_SECRET',
    'POWERBI_TENANT_ID',
  ] as const;

  return keys.filter((key) => !env[key]);
}
