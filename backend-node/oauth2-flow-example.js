const { exchangeCodeForToken } = require('./exchange-code-for-token');

/**
 * Exemple complet du flow OAuth2 Authorization Code
 * 
 * Ce script montre comment :
 * 1. Faire une requête à l'endpoint /authorize pour obtenir un code
 * 2. Extraire le code depuis la réponse Location
 * 3. Échanger le code contre un token d'accès
 */

async function completeOAuth2Flow() {
  const baseUrl = process.env.API_URL || 'http://localhost:8001';
  const username = process.env.USERNAME || 'hba_atline';
  const password = process.env.PASSWORD || 'Hamza@line22';
  
  console.log('🔄 Démarrage du flow OAuth2 Authorization Code\n');

  try {
    // Étape 1: Obtenir un token Bearer pour l'authentification
    console.log('📤 Étape 1: Authentification pour obtenir un Bearer token...');
    const loginResponse = await fetch(`${baseUrl}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      throw new Error(`Échec de l'authentification: ${loginResponse.status} - ${errorText}`);
    }

    const loginData = await loginResponse.json();
    const bearerToken = loginData.access_token;
    console.log('✅ Token Bearer obtenu\n');

    // Étape 2: Obtenir un code d'autorisation
    console.log('📤 Étape 2: Demande d\'un code d\'autorisation...');
    const authorizeUrl = new URL(`${baseUrl}/oauth2/authorize`);
    authorizeUrl.searchParams.append('response_type', 'code');
    authorizeUrl.searchParams.append('client_id', 'atline-services');
    authorizeUrl.searchParams.append('redirect_uri', 'www.devatline.com');
    authorizeUrl.searchParams.append('state', 'abc');

    const authorizeResponse = await fetch(authorizeUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      },
      redirect: 'manual' // Ne pas suivre automatiquement la redirection
    });

    // Récupérer le header Location depuis la réponse
    const locationHeader = authorizeResponse.headers.get('Location') || 
                           authorizeResponse.headers.get('location');

    if (!locationHeader) {
      // Si pas de Location header, peut-être que la réponse est en JSON (authorize-json)
      if (authorizeResponse.ok) {
        const jsonData = await authorizeResponse.json();
        if (jsonData.code) {
          console.log('✅ Code d\'autorisation obtenu:', jsonData.code);
          console.log('📤 Étape 3: Échange du code contre un token d\'accès...\n');
          
          // Utiliser directement le code depuis le JSON
          const tokenResponse = await fetch(`${baseUrl}/oauth2/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              grant_type: 'authorization_code',
              client_id: 'atline-services',
              client_secret: '22360C1B138EA4EA935F1B28FB1B16CB',
              code: jsonData.code,
              redirect_uri: 'www.devatline.com'
            })
          });

          if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            throw new Error(`Échec de l'échange du code: ${tokenResponse.status} - ${errorText}`);
          }

          const tokenData = await tokenResponse.json();
          console.log('✅ Token d\'accès OAuth2 obtenu:');
          console.log('   Access Token:', tokenData.access_token);
          console.log('   Token Type:', tokenData.token_type);
          console.log('   Expires In:', tokenData.expires_in, 'secondes');
          return tokenData;
        }
      }
      throw new Error('Aucun code d\'autorisation trouvé dans la réponse');
    }

    console.log('✅ Header Location obtenu:', locationHeader);
    
    // Étape 3: Extraire le code et l'échanger contre un token
    console.log('📤 Étape 3: Extraction du code et échange contre un token d\'accès...\n');
    
    const responseObject = {
      Location: locationHeader
    };

    const tokenData = await exchangeCodeForToken(responseObject, {
      tokenEndpoint: `${baseUrl}/oauth2/token`,
      clientId: 'atline-services',
      clientSecret: '22360C1B138EA4EA935F1B28FB1B16CB',
      redirectUri: 'www.devatline.com'
    });

    console.log('✅ Token d\'accès OAuth2 obtenu:');
    console.log('   Access Token:', tokenData.access_token);
    console.log('   Token Type:', tokenData.token_type);
    if (tokenData.expires_in) {
      console.log('   Expires In:', tokenData.expires_in, 'secondes');
    }

    return tokenData;

  } catch (error) {
    console.error('❌ Erreur lors du flow OAuth2:', error.message);
    throw error;
  }
}

// Exécuter le flow si le script est appelé directement
if (require.main === module) {
  completeOAuth2Flow()
    .then(() => {
      console.log('\n✅ Flow OAuth2 complété avec succès!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Échec du flow OAuth2:', error.message);
      process.exit(1);
    });
}

module.exports = { completeOAuth2Flow };







