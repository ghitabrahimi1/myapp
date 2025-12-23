# Scripts de gestion de la base de données SQLite

## Scripts disponibles

### 1. Visualiser la base de données
```bash
node view-db.js
```
Affiche tous les utilisateurs, clients OAuth2 et codes d'autorisation.

### 2. Créer un utilisateur
```bash
node create-user.js
```
Crée un nouvel utilisateur de manière interactive. Vous serez invité à entrer :
- Nom d'utilisateur ou email (format: nom_utilisateur ou nom@atline.com)
- Mot de passe (minimum 6 caractères)

Le domaine @atline.com sera ajouté automatiquement si vous entrez seulement le nom d'utilisateur.

### 3. Supprimer un utilisateur
```bash
node delete-user.js
```
Supprime un utilisateur de la base de données. Affiche la liste des utilisateurs et demande confirmation.

### 4. Réinitialiser un mot de passe
```bash
node reset-password.js
```
Change le mot de passe d'un utilisateur existant.

## Exemples d'utilisation

### Créer un utilisateur rapidement
```bash
node create-user.js
# Entrez: test (ou test@atline.com)
# Entrez: password123
```

Ou avec le script simple :
```bash
node create-user-simple.js test password123
# Crée automatiquement: test@atline.com
```

### Voir tous les utilisateurs
```bash
node view-db.js
```

### Supprimer un utilisateur
```bash
node delete-user.js
# Sélectionnez l'ID de l'utilisateur à supprimer
# Confirmez avec "oui"
```

## Structure de la base de données

### Table `users`
- `id` : Identifiant unique
- `email` : Email de l'utilisateur (unique)
- `password` : Mot de passe hashé avec bcrypt
- `is_active` : Statut actif (1 = actif, 0 = inactif)
- `created_at` : Date de création

### Table `oauth2_clients`
- `id` : Identifiant unique
- `client_id` : ID du client OAuth2
- `client_secret` : Secret du client
- `redirect_uri` : URI de redirection
- `is_active` : Statut actif

### Table `authorization_codes`
- `id` : Identifiant unique
- `code` : Code d'autorisation
- `client_id` : ID du client
- `user_id` : ID de l'utilisateur
- `expires_at` : Date d'expiration
- `used` : Code utilisé (1 = oui, 0 = non)

