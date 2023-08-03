interface KeycloakConfig {
  clientId: string;
  realm: string;
  authUrl: string;
  redirectUrl: string;
}

import * as WebBrowser from 'expo-web-browser';

const keycloakConfig: KeycloakConfig = {
  clientId: 'schoolall-mobile',
  realm: 'schoolall',
  authUrl: 'https://auth.schoolall.io/realms/schoolall/protocol/openid-connect/auth',
  redirectUrl: 'http://localhost:8081',
};

export const loginWithKeycloak = async () => {
  const authUrl = `${keycloakConfig.authUrl}?client_id=${keycloakConfig.clientId}&redirect_uri=${encodeURIComponent(
    keycloakConfig.redirectUrl
  )}&response_type=code`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl);

  if (result.type === 'success' && result.url) {
    const code = getCodeFromUrl(result.url);
    const tokenResponse = await fetchToken(code);
    return tokenResponse;
  } else {
    throw new Error('Keycloak authentication failed.');
  }
};
  
  const getCodeFromUrl = (url: string): string => {
    const queryParams = url.split('?')[1];
    const params = queryParams.split('&').reduce((params, param) => {
      const [key, value] = param.split('=');
      params[key] = value;
      return params;
    }, {} as Record<string, string>);
    return params['code'];
  };
  
  interface TokenResponse {
    access_token: string;
    expires_in: number;
    // Will add other properties later (e.g., refresh_token, token_type, etc.).
  }
  
  const fetchToken = async (code: string): Promise<TokenResponse> => {
    const tokenUrl = `${keycloakConfig.authUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
    const params = {
      grant_type: 'authorization_code',
      client_id: keycloakConfig.clientId,
      code: code,
      redirect_uri: keycloakConfig.redirectUrl,
    };
  
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: Object.keys(params)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&'),
    });
  
    if (!tokenResponse.ok) {
      throw new Error('Failed to fetch token from Keycloak.');
    }
  
    const tokenData: TokenResponse = await tokenResponse.json();
    return tokenData;
  };
  