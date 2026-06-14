import { env, isPowerBiEmbedConfigured, isPowerBiLinkConfigured } from '../config/env';
import { logger } from '../utils/logger';

interface EmbedTokenResponse {
  token: string;
  tokenId: string;
  expiration: string;
}

interface AzureTokenResponse {
  access_token: string;
  expires_in: number;
}

export interface PowerBiConfig {
  mode: 'embed' | 'link' | 'disabled';
  enabled: boolean;
  message: string;
  embedUrl?: string;
  reportId?: string;
  reportUrl?: string;
  workspaceId?: string;
  dashboardUrl?: string;
  accessToken?: string;
  expiration?: string;
}

let cachedToken: { token: string; expiration: Date } | null = null;

async function getAzureAccessToken(): Promise<string> {
  const url = `https://login.microsoftonline.com/${env.POWERBI_TENANT_ID}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: env.POWERBI_CLIENT_ID!,
    client_secret: env.POWERBI_CLIENT_SECRET!,
    scope: 'https://analysis.windows.net/powerbi/api/.default',
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    logger.error('Failed to obtain Azure AD token for Power BI', { status: response.status });
    throw new Error('Failed to authenticate with Power BI');
  }

  const data = (await response.json()) as AzureTokenResponse;
  return data.access_token;
}

async function getEmbedToken(accessToken: string): Promise<EmbedTokenResponse> {
  const url = `https://api.powerbi.com/v1.0/myorg/groups/${env.POWERBI_WORKSPACE_ID}/reports/${env.POWERBI_REPORT_ID}/GenerateToken`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      accessLevel: 'View',
      allowSaveAs: false,
    }),
  });

  if (!response.ok) {
    logger.error('Failed to generate Power BI embed token', { status: response.status });
    throw new Error('Failed to generate embed token');
  }

  return (await response.json()) as EmbedTokenResponse;
}

export async function getEmbedConfig(): Promise<PowerBiConfig> {
  if (!isPowerBiEmbedConfigured()) {
    if (!isPowerBiLinkConfigured()) {
      return {
        mode: 'disabled',
        enabled: false,
        message:
          'Power BI not configured. Set POWERBI_DASHBOARD_URL to your Fabric report link (Azure embed skipped for now).',
      };
    }

    return {
      mode: 'link',
      enabled: false,
      message: 'Azure embed skipped. Open reportUrl in a new browser tab while logged into Microsoft.',
      reportUrl: env.POWERBI_DASHBOARD_URL,
      dashboardUrl: env.POWERBI_DASHBOARD_URL,
      workspaceId: env.POWERBI_WORKSPACE_ID,
      reportId: env.POWERBI_REPORT_ID,
    };
  }

  if (cachedToken && cachedToken.expiration > new Date()) {
    return {
      mode: 'embed',
      enabled: true,
      message: 'Power BI embed token ready.',
      embedUrl: env.POWERBI_EMBED_URL,
      reportId: env.POWERBI_REPORT_ID,
      dashboardUrl: env.POWERBI_DASHBOARD_URL,
      workspaceId: env.POWERBI_WORKSPACE_ID,
      accessToken: cachedToken.token,
      expiration: cachedToken.expiration.toISOString(),
    };
  }

  const accessToken = await getAzureAccessToken();
  const embedToken = await getEmbedToken(accessToken);

  cachedToken = {
    token: embedToken.token,
    expiration: new Date(embedToken.expiration),
  };

  return {
    mode: 'embed',
    enabled: true,
    message: 'Power BI embed token ready.',
    embedUrl: env.POWERBI_EMBED_URL,
    reportId: env.POWERBI_REPORT_ID,
    dashboardUrl: env.POWERBI_DASHBOARD_URL,
    workspaceId: env.POWERBI_WORKSPACE_ID,
    accessToken: embedToken.token,
    expiration: embedToken.expiration,
  };
}
