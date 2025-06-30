import { PublicClientApplication,
  type Configuration } from '@azure/msal-browser'
import { MSAL_CONFIG } from '@/constants/auth'

const msalConfig: Configuration = MSAL_CONFIG;

const msalInstance = new PublicClientApplication(msalConfig);

// Ensure it's initialized once before usage
await msalInstance.initialize(); // ✅ REQUIRED for v3+ apps

export { msalInstance };
