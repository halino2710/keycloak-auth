// import * as WebBrowser from 'expo-web-browser';
// import * as AuthSession  from 'expo-auth-session';
// import Constants from 'expo-constants';

// const keycloakConfig = {
//   clientId: 'KEYCLOAK_CLIENT_ID',
//   realm: 'KEYCLOAK_REALM',
//   authUrl: 'KEYCLOAK_AUTH_URL',
//   redirectUrl: "KEYCLOACK_REDIRECT_URL",
// };

// export const loginWithKeycloack = async () => {
//     const authUrl = `${keycloakConfig.authUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth?client_id=${keycloakConfig.clientId}&redirect_uri=${encodeURIComponent(
//         keycloakConfig.redirectUrl
//       )}&response_type=code`;

//       const result = await WebBrowser.openAuthSessionAsync(authUrl, keycloakConfig.redirectUrl);

//       if (result.type === 'success') {
//         const url = result.url;
//         const code = getCodeFromUrl(url);
//         const tokenResponse = await fetchToken(code);
//         return tokenResponse;
//       } else {
//         throw new Error('Keycloak authentication failed.');
//       }
//     };

//     const getCodeFromUrl = (url: any) => {
//   // Extract the code from the URL, assuming it's present in the query string.
//   // You may need to adjust this code if your Keycloak server returns the code differently.

//   const queryParams = url.split('?')[1];
//   const params = queryParams.split('&').reduce((params: any, param: any) => {
//     const [key, value] = param.split('=');
//     params[key] = value;
//     return params;
//   }, {});
//   return params['code'];
// };

// const fetchToken = async (code: any) => {
//   const tokenUrl = `${keycloakConfig.authUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
//   const params = {
//     grant_type: 'authorization_code',
//     client_id: keycloakConfig.clientId,
//     code: code,
//     redirect_uri: keycloakConfig.redirectUrl,
//   };

//   const tokenResponse = await fetch(tokenUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: Object.keys(params)
//       .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
//       .join('&'),
//   });

//   if (!tokenResponse.ok) {
//     throw new Error('Failed to fetch token from Keycloak.');
//   }

//   const tokenData = await tokenResponse.json();
//   return tokenData;
// };


interface KeycloakConfig {
    clientId: string;
    realm: string;
    issuer: string;
    redirectUrl: string;
  }
  
  import * as WebBrowser from 'expo-web-browser';
  import * as AuthSession from 'expo-auth-session';
  import Constants from 'expo-constants';
  
  const keycloakConfig: KeycloakConfig = {
    clientId: 'schoolall-mobile',
    realm: 'schoolall',
    issuer: "https://auth.schoolall.io",
    redirectUrl: 'schoolall-mobile', // Replace this with the actual redirect URL from Keycloak
  };
  
  export const loginWithKeycloak = async () => {
    const authUrl = `${keycloakConfig.issuer}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth/client_id=${keycloakConfig.clientId}&redirect_uri=${encodeURIComponent(
      keycloakConfig.redirectUrl
    )}&response_type=code`;
  
    const result = await WebBrowser.openAuthSessionAsync(authUrl, keycloakConfig.redirectUrl);
  
    if (result.type === 'success' && result.url) {
      const code = getCodeFromUrl(result.url);
      const tokenResponse = await fetchToken(code);
      return tokenResponse;
    } else {
      throw new Error('Keycloak authentication failed.');
    }
  };
  
  const getCodeFromUrl = (url: string): string => {
    // Extract the code from the URL, assuming it's present in the query string.
    // You may need to adjust this code if your Keycloak server returns the code differently.
    const queryParams = url.split('?')[1];
    const params = queryParams.split('&').reduce((params, param) => {
      const [key, value] = param.split('=');
      params[key] = value;
      return params;
    }, {} as Record<string, string>);
    return params['code'];
  };
  
  interface TokenResponse {
    // Define the properties of the token response here based on the actual response from Keycloak.
    access_token: string;
    expires_in: number;
    // Add other properties if needed (e.g., refresh_token, token_type, etc.).
  }
  
  const fetchToken = async (code: string): Promise<TokenResponse> => {
    const tokenUrl = `${keycloakConfig.issuer}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
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
  