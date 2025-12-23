# Backend Node.js/Express - OAuth2

## Installation rapide

```bash
cd backend-node
npm install
npm start
```

## Accès

- **API** : http://localhost:8000
- **Health** : http://localhost:8000/health

## Endpoints

### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/token` - Login (obtenir Bearer token)
- `GET /auth/me` - Profil utilisateur

### OAuth2
- `GET /oauth2/authorize-json` - Obtenir code d'autorisation (retourne JSON)
- `POST /oauth2/token` - Échanger code contre access_token

## Flow OAuth2

1. Login avec `/auth/token` → obtenir Bearer token
2. Appeler `/oauth2/authorize-json` avec Bearer token → obtenir code
3. Appeler `/oauth2/token` avec le code → obtenir access_token

## Fonction utilitaire : exchangeCodeForToken

Une fonction utilitaire est disponible pour extraire automatiquement le code d'autorisation depuis une URL de redirection (header `Location`) et l'échanger contre un token d'accès.

### Utilisation basique

```javascript
const { exchangeCodeForToken } = require('./exchange-code-for-token');

// Exemple avec un objet contenant le header Location
const response = {
  "Location": "https://dev.atline-services.com/?code=2e61607437d39797952084641dfa3eb5b7485c99&state=login"
};

exchangeCodeForToken(response)
  .then((result) => {
    console.log('Access Token:', result.access_token);
    console.log('Token Type:', result.token_type);
  })
  .catch((error) => {
    console.error('Erreur:', error.message);
  });
```

### Formats de réponse supportés

La fonction accepte plusieurs formats :

1. **Objet avec propriété `Location`** :
```javascript
{ "Location": "https://example.com/?code=abc123&state=xyz" }
```

2. **Objet avec `headers.location` ou `headers.Location`** :
```javascript
{ headers: { location: "https://example.com/?code=abc123" } }
```

3. **URL directe en string** :
```javascript
"https://example.com/?code=abc123&state=xyz"
```

4. **JSON stringifié** :
```javascript
'{"Location": "https://example.com/?code=abc123"}'
```

### Options personnalisées

```javascript
exchangeCodeForToken(response, {
  tokenEndpoint: 'http://localhost:8001/oauth2/token',
  clientId: 'atline-services',
  clientSecret: '22360C1B138EA4EA935F1B28FB1B16CB',
  redirectUri: 'www.devatline.com'
});
```

### Exemples complets

- **Script de test** : `node test-exchange-code.js`
- **Flow OAuth2 complet** : `node oauth2-flow-example.js`

