import { env, isPowerBiLinkConfigured } from '../config/env';

export interface PowerBiConfig {
  mode: 'link' | 'disabled';
  enabled: boolean;
  message: string;
  reportUrl?: string;
  workspaceId?: string;
  reportId?: string;
}

export async function getEmbedConfig(): Promise<PowerBiConfig> {
  if (!isPowerBiLinkConfigured()) {
    return {
      mode: 'disabled',
      enabled: false,
      message: 'Set POWERBI_DASHBOARD_URL to your Fabric report link (demo: open in browser).',
    };
  }

  return {
    mode: 'link',
    enabled: false,
    message: 'Demo mode: open reportUrl in a new browser tab (no Azure client ID required).',
    reportUrl: env.POWERBI_DASHBOARD_URL,
    workspaceId: env.POWERBI_WORKSPACE_ID,
    reportId: env.POWERBI_REPORT_ID,
  };
}
