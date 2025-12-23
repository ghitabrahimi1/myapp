# Guide de test pour authorizeRequest

## Méthode 1 : Test via l'interface de l'application

1. **Démarrer l'application web** :
   ```bash
   npm run web
   ```

2. **Ouvrir les outils de développement** :
   - Appuyez sur `F12` ou `Ctrl+Shift+I` (Windows/Linux)
   - Ou `Cmd+Option+I` (Mac)

3. **Aller dans l'onglet Network (Réseau)** :
   - Cliquez sur l'onglet "Network" ou "Réseau"
   - Assurez-vous que l'enregistrement est activé (bouton rouge)

4. **Filtrer les requêtes** :
   - Dans le champ de filtre, tapez : `authorize`
   - Cela affichera uniquement les requêtes vers `/authorize`

5. **Se connecter** :
   - Entrez un username (ex: `hba_atline`)
   - Entrez un password (ex: `Hamza@line22`)
   - Cliquez sur "Se connecter"

6. **Vérifier la requête** :
   - Vous devriez voir une requête POST vers `https://wspp.atline.fr/authorize`
   - Cliquez dessus pour voir les détails

7. **Vérifier la réponse** :
   - Onglet "Headers" → Regardez "Response Headers"
   - Cherchez le header `Location`
   - Il devrait contenir : `https://dev.atline-services.com/?code=...&state=abc`

## Méthode 2 : Test via la console du navigateur

1. **Ouvrir la console** :
   - Appuyez sur `F12`
   - Allez dans l'onglet "Console"

2. **Vérifier les logs** :
   - Après avoir cliqué sur "Se connecter", vous devriez voir :
     ```
     Location header: https://dev.atline-services.com/?code=329ae352f784705d05044a16343e4713883ac313&state=abc
     Extracted code: 329ae352f784705d05044a16343e4713883ac313 state: abc
     ```

## Méthode 3 : Test direct dans la console

Vous pouvez tester directement la fonction dans la console :

```javascript
// Dans la console du navigateur, après avoir chargé l'application
// La fonction est exportée, donc vous pouvez l'importer dynamiquement

// Option 1 : Via le module (si disponible)
const { authorizeRequest } = await import('./screens/LoginScreen');
const response = await authorizeRequest('hba_atline', 'Hamza@line22');
console.log('Status:', response.status);
console.log('Location:', response.headers.get('Location'));

// Option 2 : Test manuel de la requête
const today = new Date().toISOString().split('T')[0];
const SHA256 = (await import('crypto-js/sha256')).default;
const hashedPassword = SHA256('Hamza@line22' + today).toString();

const body = new URLSearchParams({
  response_type: 'code',
  client_id: 'atline-services',
  state: 'abc',
  login: 'hba_atline',
  password: hashedPassword,
  redirect_uri: 'www.devatline.com',
}).toString();

const response = await fetch('https://wspp.atline.fr/authorize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body,
  redirect: 'manual',
});

console.log('Status:', response.status);
console.log('Location:', response.headers.get('Location'));
```

## Ce qu'il faut vérifier :

✅ **La requête POST est envoyée** vers `https://wspp.atline.fr/authorize`

✅ **Le body contient** :
   - `response_type=code`
   - `client_id=atline-services`
   - `state=abc`
   - `login=hba_atline` (ou votre username)
   - `password=<hash>` (mot de passe hashé avec SHA256 + date)
   - `redirect_uri=www.devatline.com`

✅ **La réponse a le status** `302`, `301`, `307`, ou `308` (redirection)

✅ **Le header Location contient** :
   - `https://dev.atline-services.com/?code=...&state=abc`
   - Le code OAuth2 est présent dans l'URL

✅ **Les logs dans la console** affichent :
   - Le header Location complet
   - Le code extrait
   - Le state extrait

## En cas d'erreur :

- **Status 400/401** : Vérifiez les credentials (username/password)
- **Pas de header Location** : Vérifiez que le serveur renvoie bien une redirection
- **Code manquant** : Vérifiez que l'URL de redirection contient bien le paramètre `code`





