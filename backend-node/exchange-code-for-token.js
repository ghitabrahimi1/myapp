/**
 * Fonction pour extraire le code d'autorisation depuis une URL de redirection
 * et l'échanger contre un token d'accès OAuth2
 * 
 * @param {string|object} response - La réponse HTTP contenant le header Location ou l'URL complète
 * @param {object} options - Options de configuration
 * @param {string} options.tokenEndpoint - URL du endpoint token (défaut: 'https://wspp.atline.fr/token')
 * @param {string} options.clientId - Client ID OAuth2 (défaut: 'atline-services')
 * @param {string} options.clientSecret - Client secret OAuth2 (défaut: '22360C1B138EA4EA935F1B28FB1B16CB')
 * @param {string} options.redirectUri - Redirect URI (défaut: 'www.devatline.com')
 * @returns {Promise<object>} - Promise qui résout avec { access_token, token_type, expires_in } ou rejette avec une erreur
 */
async function exchangeCodeForToken(response, options = {}) {
  const {
    tokenEndpoint = 'https://wspp.atline.fr/token',
    clientId = 'atline-services',
    clientSecret = '22360C1B138EA4EA935F1B28FB1B16CB',
    redirectUri = 'www.devatline.com'
  } = options;

  // Extraire l'URL depuis la réponse
  let locationUrl = null;
  
  if (typeof response === 'string') {
    // Si c'est une chaîne, c'est soit une URL complète, soit un JSON stringifié
    try {
      const parsed = JSON.parse(response);
      if (parsed.Location) {
        locationUrl = parsed.Location;
      } else {
        locationUrl = response;
      }
    } catch (e) {
      // Ce n'est pas du JSON, c'est probablement une URL directe
      locationUrl = response;
    }
  } else if (response && typeof response === 'object') {
    // Si c'est un objet, chercher le header Location ou la propriété Location
    if (response.headers && response.headers.location) {
      locationUrl = response.headers.location;
    } else if (response.headers && response.headers.Location) {
      locationUrl = response.headers.Location;
    } else if (response.Location) {
      locationUrl = response.Location;
    } else if (response.location) {
      locationUrl = response.location;
    } else {
      throw new Error('Aucune URL de redirection trouvée dans la réponse');
    }
  } else {
    throw new Error('Format de réponse invalide');
  }

  // Utiliser une expression régulière pour extraire le code de l'URL
  // Les codes base64url peuvent contenir: lettres, chiffres, tirets (-) et underscores (_)
  const codeRegex = /[?&]code=([a-zA-Z0-9_-]+)/;
  const match = locationUrl.match(codeRegex);

  if (!match || !match[1]) {
    throw new Error('Aucun code d\'autorisation trouvé dans l\'URL de redirection');
  }

  const code = match[1];

  // Faire la requête POST au endpoint token
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur lors de l'appel au endpoint token: ${response.status} - ${errorText}`);
    }

    const responseJson = await response.json();
    
    if (!responseJson.access_token) {
      throw new Error('Access token non trouvé dans la réponse');
    }

    return {
      access_token: responseJson.access_token,
      token_type: responseJson.token_type || 'bearer',
      expires_in: responseJson.expires_in,
      ...responseJson // Inclure d'autres propriétés si présentes
    };
  } catch (error) {
    if (error.message.includes('fetch')) {
      // Si fetch n'est pas disponible, utiliser https natif
      return exchangeCodeForTokenWithHttps(code, {
        tokenEndpoint,
        clientId,
        clientSecret,
        redirectUri
      });
    }
    throw error;
  }
}

/**
 * Version alternative utilisant le module https natif de Node.js
 * (utilisée si fetch n'est pas disponible)
 */
function exchangeCodeForTokenWithHttps(code, options) {
  const https = require('https');
  const { URL } = require('url');

  return new Promise((resolve, reject) => {
    const url = new URL(options.tokenEndpoint);
    
    const postData = JSON.stringify({
      grant_type: 'authorization_code',
      client_id: options.clientId,
      client_secret: options.clientSecret,
      code: code,
      redirect_uri: options.redirectUri
    });

    const requestOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Erreur lors de l'appel au endpoint token: ${res.statusCode} - ${data}`));
        }

        try {
          const responseJson = JSON.parse(data);
          
          if (!responseJson.access_token) {
            return reject(new Error('Access token non trouvé dans la réponse'));
          }

          resolve({
            access_token: responseJson.access_token,
            token_type: responseJson.token_type || 'bearer',
            expires_in: responseJson.expires_in,
            ...responseJson
          });
        } catch (error) {
          reject(new Error(`Erreur lors du parsing de la réponse: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Erreur lors de l'appel au endpoint token: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

module.exports = { exchangeCodeForToken };

// Exemple d'utilisation si le fichier est exécuté directement
if (require.main === module) {
  // Exemple avec l'objet de réponse que vous avez fourni
  const exampleResponse = {
    "Location": "https://dev.atline-services.com/?code=2e61607437d39797952084641dfa3eb5b7485c99&state=login"
  };

  exchangeCodeForToken(exampleResponse)
    .then((result) => {
      console.log('✅ Token d\'accès obtenu avec succès:');
      console.log('Access Token:', result.access_token);
      console.log('Token Type:', result.token_type);
      console.log('Expires In:', result.expires_in);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error.message);
      process.exit(1);
    });
}

