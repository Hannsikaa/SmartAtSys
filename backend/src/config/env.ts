import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

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

  POWERBI_DASHBOARD_URL: z.string().url().optional(),
  POWERBI_WORKSPACE_ID: z.string().optional(),
  POWERBI_REPORT_ID: z.string().optional(),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  ADMIN_FACULTY_IDS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid or missing environment variables.');
  console.error('\nValidation errors:', parsed.error.flatten().fieldErrors);
  console.error('\nSee docs/ENV.md and docs/DATABASE_SETUP.md');
  process.exit(1);
}

export const env = parsed.data;

export function isPowerBiLinkConfigured(): boolean {
  return Boolean(env.POWERBI_DASHBOARD_URL);
}
