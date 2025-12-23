// Configuration OAuth2
export const OAUTH2_CONFIG = {
  // URL d'autorisation (où l'utilisateur se connecte)
  AUTHORIZATION_URL: 'https://dev.atline-services.com/oauth2/authorize',
  
  // URL de redirection après authentification
  REDIRECT_URI: 'https://dev.atline-services.com/',
  
  // Endpoint pour échanger le code contre un token
  TOKEN_URL: 'https://wspp.atline.fr/token',
  
  // Identifiants client
  CLIENT_ID: 'atline-services',
  
  // Le client_secret doit être stocké de manière sécurisée
  // En production, utilisez react-native-keychain ou une solution similaire
  CLIENT_SECRET: 'YOUR_CLIENT_SECRET_HERE',
  
  // Scope (optionnel, ajustez selon vos besoins)
  SCOPE: 'openid profile email',
  
  // Paramètre state pour la sécurité CSRF
  STATE: 'login',
};

// Fonction helper pour encoder les paramètres URL
const encodeParam = (key: string, value: string): string => {
  return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
};

// Fonction pour construire l'URL d'autorisation complète
export const buildAuthorizationUrl = (state: string = OAUTH2_CONFIG.STATE): string => {
  const params = [
    encodeParam('response_type', 'code'),
    encodeParam('client_id', OAUTH2_CONFIG.CLIENT_ID),
    encodeParam('redirect_uri', OAUTH2_CONFIG.REDIRECT_URI),
    encodeParam('state', state),
    encodeParam('scope', OAUTH2_CONFIG.SCOPE),
  ].join('&');
  
  return `${OAUTH2_CONFIG.AUTHORIZATION_URL}?${params}`;
};

// Fonction pour extraire les paramètres de l'URL
const parseUrlParams = (url: string): { [key: string]: string } => {
  const params: { [key: string]: string } = {};
  try {
    const queryString = url.split('?')[1];
    if (queryString) {
      const pairs = queryString.split('&');
      pairs.forEach((pair) => {
        const [key, value] = pair.split('=');
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors du parsing de l\'URL:', error);
  }
  return params;
};

// Fonction pour extraire le code depuis l'URL de redirection
export const extractCodeFromUrl = (url: string): string | null => {
  try {
    const params = parseUrlParams(url);
    return params['code'] || null;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du code:', error);
    return null;
  }
};

// Fonction pour vérifier si l'URL est la redirection OAuth2
export const isOAuth2Redirect = (url: string): boolean => {
  try {
    // Vérifier que l'URL commence par le domaine attendu et contient le paramètre code
    return url.includes('https://dev.atline-services.com') && 
           url.includes('code=');
  } catch (error) {
    return false;
  }
};

