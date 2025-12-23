const { exchangeCodeForToken } = require('./exchange-code-for-token');

/**
 * Script de test pour la fonction exchangeCodeForToken
 * 
 * Exemples d'utilisation avec différents formats de réponse
 */

async function runTests() {
  console.log('🧪 Test de la fonction exchangeCodeForToken\n');

  // Exemple 1: Objet avec propriété Location
  console.log('📝 Exemple 1: Objet avec propriété Location');
  const example1 = {
    "Location": "https://dev.atline-services.com/?code=2e61607437d39797952084641dfa3eb5b7485c99&state=login"
  };

  try {
    const result = await exchangeCodeForToken(example1);
    console.log('✅ Succès!');
    console.log('Access Token:', result.access_token);
    console.log('Token Type:', result.token_type);
    if (result.expires_in) {
      console.log('Expires In:', result.expires_in, 'secondes');
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    console.log('(C\'est normal si le code n\'existe pas dans la base de données)');
  }

  // Exemple 2: Objet avec headers.location (minuscule)
  console.log('\n📝 Exemple 2: Objet avec headers.location');
  const example2 = {
    headers: {
      location: "https://dev.atline-services.com/?code=abc123&state=xyz"
    }
  };

  try {
    const result = await exchangeCodeForToken(example2);
    console.log('✅ Succès!');
    console.log('Access Token:', result.access_token);
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    console.log('(C\'est normal si le code n\'existe pas dans la base de données)');
  }

  // Exemple 3: URL directe en string
  console.log('\n📝 Exemple 3: URL directe en string');
  const example3 = "https://dev.atline-services.com/?code=test123&state=abc";

  try {
    const result = await exchangeCodeForToken(example3);
    console.log('✅ Succès!');
    console.log('Access Token:', result.access_token);
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    console.log('(C\'est normal si le code n\'existe pas dans la base de données)');
  }

  // Exemple 4: Avec options personnalisées
  console.log('\n📝 Exemple 4: Avec options personnalisées');
  const example4 = {
    "Location": "https://dev.atline-services.com/?code=test456&state=xyz"
  };

  try {
    const result = await exchangeCodeForToken(example4, {
      tokenEndpoint: 'http://localhost:8001/oauth2/token',
      clientId: 'atline-services',
      clientSecret: '22360C1B138EA4EA935F1B28FB1B16CB',
      redirectUri: 'www.devatline.com'
    });
    console.log('✅ Succès!');
    console.log('Access Token:', result.access_token);
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    console.log('(C\'est normal si le code n\'existe pas dans la base de données)');
  }

  console.log('\n✅ Tests terminés!');
}

// Exécuter les tests
runTests().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});

