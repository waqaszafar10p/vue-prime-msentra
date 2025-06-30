const VITE_MS_AUTH_URI = import.meta.env.VITE_MS_AUTH_URI;
const VITE_MICROSOFT_TENANT_ID = import.meta.env.VITE_MICROSOFT_TENANT_ID;
const authority = `${VITE_MS_AUTH_URI}/${VITE_MICROSOFT_TENANT_ID}`;

export const MSAL_CONFIG = {
    auth: {
      clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
      authority: authority,
      redirectUri: import.meta.env.VITE_MS_AUTH_REDIRECTION_URI,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  }
  
  export const LOGIN_SCOPES = ['openid', 'profile', 'email','offline_access']