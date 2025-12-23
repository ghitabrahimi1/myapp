const { exchangeCodeForToken } = require('./exchange-code-for-token');

/**
 * Test avec un vrai code d'autorisation
 * 
 * Ce script nécessite :
 * 1. Un serveur qui tourne sur http://localhost:8001
 * 2. Un utilisateur valide dans la base de données
 * 
 * Usage:
 *   USERNAME=hba_atline PASSWORD=Hamza@line22 node test-with-real-code.js
 */

async function testWithRealCode() {
  const baseUrl = process.env.API_URL || 'http://localhost:8001';
  const username = process.env.USERNAME || 'hba_atline';
  const password = process.env.PASSWORD || 'Hamza@line22';

  console.log('🔄 Test avec un vrai code d\'autorisation\n');

  try {
    // Étape 1: Obtenir un Bearer token
    console.log('📤 Étape 1: Authentification...');
    const loginResponse = await fetch(`${baseUrl}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!loginResponse.ok) {
      throw new Error(`Échec de l'authentification: ${loginResponse.status}`);
    }

    const { access_token: bearerToken } = await loginResponse.json();
    console.log('✅ Token Bearer obtenu\n');

    // Étape 2: Obtenir un code d'autorisation
    console.log('📤 Étape 2: Demande d\'un code d\'autorisation...');
    const authorizeUrl = new URL(`${baseUrl}/oauth2/authorize-json`);
    authorizeUrl.searchParams.append('response_type', 'code');
    authorizeUrl.searchParams.append('client_id', 'atline-services');
    authorizeUrl.searchParams.append('redirect_uri', 'www.devatline.com');
    authorizeUrl.searchParams.append('state', 'test123');

    const authorizeResponse = await fetch(authorizeUrl.toString(), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${bearerToken}` }
    });

    if (!authorizeResponse.ok) {
      throw new Error(`Échec de l'autorisation: ${authorizeResponse.status}`);
    }

    const { code } = await authorizeResponse.json();
    console.log('✅ Code d\'autorisation obtenu:', code);

    // Étape 3: Simuler une réponse avec le header Location
    console.log('\n📤 Étape 3: Test de la fonction exchangeCodeForToken...');
    const mockResponse = {
      "Location": `https://dev.atline-services.com/?code=${code}&state=test123`
    };

    const tokenResult = await exchangeCodeForToken(mockResponse, {
      tokenEndpoint: `${baseUrl}/oauth2/token`,
      clientId: 'atline-services',
      clientSecret: '22360C1B138EA4EA935F1B28FB1B16CB',
      redirectUri: 'www.devatline.com'
    });

    console.log('\n✅ Succès! Token d\'accès OAuth2 obtenu:');
    console.log('   Access Token:', tokenResult.access_token);
    console.log('   Token Type:', tokenResult.token_type);
    if (tokenResult.expires_in) {
      console.log('   Expires In:', tokenResult.expires_in, 'secondes');
    }

    return tokenResult;

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    throw error;
  }
}

// Exécuter le test si le script est appelé directement
if (require.main === module) {
  testWithRealCode()
    .then(() => {
      console.log('\n✅ Test complété avec succès!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Échec du test:', error.message);
      process.exit(1);
    });
}

module.exports = { testWithRealCode };







