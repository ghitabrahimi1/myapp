# Guide de connexion OAuth2

## Comment se connecter avec OAuth2

### Flux de connexion

1. **Cliquez sur "Se connecter avec OAuth2"** dans l'écran de login

2. **Le navigateur s'ouvre automatiquement** avec la page de connexion Atline :
   - URL : `https://dev.atline-services.com/oauth2/authorize`
   - Vous verrez le formulaire de connexion du site Atline

3. **Connectez-vous** avec vos identifiants Atline dans le navigateur

4. **Après la connexion**, le site vous redirige automatiquement vers l'application

5. **L'application reçoit le code d'autorisation** et échange ce code contre un token d'accès

6. **Vous êtes connecté** dans l'application

### Configuration actuelle

- **URL d'autorisation** : `https://dev.atline-services.com/oauth2/authorize`
- **URL de redirection** : `https://dev.atline-services.com/`
- **Client ID** : `atline-services`
- **Scopes** : `openid profile email`

### Si le navigateur ne s'ouvre pas

1. Vérifiez votre connexion internet
2. Vérifiez que l'URL `https://dev.atline-services.com` est accessible
3. Vérifiez les logs de l'application pour voir les erreurs

### Si la redirection ne fonctionne pas

Sur Android, assurez-vous que :
1. L'application est installée
2. Les deep links sont activés dans les paramètres Android
3. Le schéma `myapp://` est autorisé

### Test manuel

Vous pouvez tester l'URL d'autorisation directement dans votre navigateur :

```
https://dev.atline-services.com/oauth2/authorize?response_type=code&client_id=atline-services&redirect_uri=https://dev.atline-services.com/&state=login&scope=openid profile email
```

Après la connexion, vous serez redirigé vers `https://dev.atline-services.com/?code=XXXXX` où `XXXXX` est le code d'autorisation.







