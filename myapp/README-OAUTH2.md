# Flow OAuth2 Authorization Code - Documentation

Ce document explique comment utiliser le flow OAuth2 Authorization Code dans l'application mobile React Native.

## 📋 Vue d'ensemble

Le flow OAuth2 implémenté suit le standard Authorization Code Flow :

1. L'utilisateur clique sur "Se connecter avec OAuth2"
2. Une WebView s'ouvre avec la page de login OAuth2
3. L'utilisateur se connecte sur le serveur OAuth2
4. Le serveur redirige vers `https://dev.atline-services.com/?code=XXXX&state=login`
5. L'application intercepte cette URL et extrait le code
6. L'application échange le code contre un access_token via `POST https://wspp.atline.fr/token`
7. L'access_token est stocké localement avec AsyncStorage
8. L'utilisateur est redirigé vers l'écran Home

## 🔧 Configuration

### 1. Configuration OAuth2

Le fichier `config/oauth2.ts` contient toute la configuration OAuth2 :

```typescript
export const OAUTH2_CONFIG = {
  AUTHORIZATION_URL: 'https://dev.atline-services.com/oauth2/authorize',
  REDIRECT_URI: 'https://dev.atline-services.com/',
  TOKEN_URL: 'https://wspp.atline.fr/token',
  CLIENT_ID: 'atline-services',
  CLIENT_SECRET: 'YOUR_CLIENT_SECRET_HERE', // ⚠️ À configurer !
  SCOPE: 'openid profile email',
  STATE: 'login',
};
```

### 2. Configuration du Client Secret

⚠️ **IMPORTANT** : Le `CLIENT_SECRET` doit être configuré de manière sécurisée.

**Option 1 : Variable d'environnement (Recommandé pour la production)**

1. Créez un fichier `.env` dans le dossier `myapp/` :
```env
OAUTH2_CLIENT_SECRET=votre_client_secret_ici
```

2. Installez `react-native-dotenv` :
```bash
npm install react-native-dotenv
```

3. Configurez `babel.config.js` pour utiliser dotenv

4. Utilisez dans `config/oauth2.ts` :
```typescript
CLIENT_SECRET: process.env.OAUTH2_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_HERE',
```

**Option 2 : Configuration sécurisée avec react-native-keychain (Recommandé)**

Pour une sécurité maximale, utilisez `react-native-keychain` pour stocker le client_secret :

```bash
npm install react-native-keychain
```

Puis modifiez `config/oauth2.ts` pour récupérer le secret depuis le keychain.

**Option 3 : Configuration manuelle**

Modifiez directement `CLIENT_SECRET` dans `config/oauth2.ts` (⚠️ Ne pas commiter ce fichier avec le secret réel).

## 📱 Utilisation

### Dans l'application

1. Sur l'écran de login, cliquez sur le bouton **"Se connecter avec OAuth2"**
2. Une WebView s'ouvre avec la page de connexion OAuth2
3. Connectez-vous avec vos identifiants
4. Vous serez automatiquement redirigé vers l'écran Home une fois connecté

### Code d'intégration

Le flow OAuth2 est déjà intégré dans `App.tsx`. Pour l'utiliser ailleurs dans l'application :

```typescript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { loginWithOAuth2 } = useAuth();
  
  const handleOAuth2Login = async (code: string) => {
    try {
      await loginWithOAuth2(code);
      // L'utilisateur est maintenant connecté
    } catch (error) {
      console.error('Erreur OAuth2:', error);
    }
  };
}
```

## 🔍 Fonctionnement technique

### 1. Écran OAuth2LoginScreen

L'écran `screens/OAuth2LoginScreen.tsx` utilise `react-native-webview` pour :

- Charger la page de login OAuth2
- Intercepter les changements de navigation
- Détecter l'URL de redirection avec le code
- Extraire le code depuis l'URL
- Appeler le callback `onCodeReceived` avec le code

### 2. AuthContext

Le `AuthContext` (`context/AuthContext.tsx`) contient la méthode `loginWithOAuth2` qui :

- Reçoit le code d'autorisation
- Appelle l'endpoint `/token` avec axios
- Stocke l'access_token dans AsyncStorage
- Met à jour l'état d'authentification

### 3. Stockage du token

Le token est stocké dans AsyncStorage avec les clés suivantes :

- `access_token` : Le token d'accès OAuth2
- `token_type` : Le type de token (généralement "Bearer")
- `token_expires_in` : Durée de validité du token (si fournie)
- `username` : Nom d'utilisateur (placeholder pour OAuth2)
- `isAuthenticated` : Statut d'authentification

## 🛠️ Dépendances

Les dépendances suivantes sont requises :

- `react-native-webview` : Pour afficher la page de login dans une WebView
- `axios` : Pour appeler l'endpoint `/token`
- `@react-native-async-storage/async-storage` : Pour stocker le token (déjà installé)

Installation :
```bash
npm install react-native-webview axios
```

## 🔒 Sécurité

### Bonnes pratiques

1. **Ne jamais commiter le CLIENT_SECRET** dans le code source
2. Utiliser des variables d'environnement ou un keychain pour le secret
3. Valider le paramètre `state` pour prévenir les attaques CSRF
4. Vérifier l'expiration du token avant de l'utiliser
5. Utiliser HTTPS uniquement pour toutes les communications

### Validation du state

Le paramètre `state` est utilisé pour prévenir les attaques CSRF. Il est défini dans la configuration et vérifié lors de la redirection.

## 🐛 Dépannage

### La WebView ne charge pas

- Vérifiez votre connexion internet
- Vérifiez que l'URL d'autorisation est correcte dans `config/oauth2.ts`
- Vérifiez les permissions réseau dans `AndroidManifest.xml` et `Info.plist`

### Erreur "Code d'autorisation non trouvé"

- Vérifiez que l'URL de redirection correspond exactement à celle configurée sur le serveur OAuth2
- Vérifiez que le serveur redirige bien vers `https://dev.atline-services.com/?code=...`

### Erreur lors de l'échange du code

- Vérifiez que le `CLIENT_SECRET` est correctement configuré
- Vérifiez que le `CLIENT_ID` correspond à celui enregistré sur le serveur
- Vérifiez que le `redirect_uri` correspond exactement à celui utilisé lors de l'autorisation

### Le token n'est pas stocké

- Vérifiez les permissions AsyncStorage
- Vérifiez les logs de la console pour les erreurs

## 📝 Notes

- Le username est actuellement défini comme `'user_oauth2'` dans `AuthContext`. Vous pouvez modifier cela pour récupérer le vrai username depuis le token JWT ou un endpoint `/me`.
- Pour récupérer les informations utilisateur depuis le token, vous pouvez décoder le JWT (si c'est un JWT) ou appeler un endpoint avec le token.

## 🔄 Améliorations futures

- [ ] Récupérer le vrai username depuis le token ou un endpoint `/me`
- [ ] Gérer le refresh token si disponible
- [ ] Implémenter la déconnexion OAuth2 côté serveur
- [ ] Ajouter un mécanisme de refresh automatique du token
- [ ] Améliorer la gestion des erreurs avec des messages plus explicites







