# Instructions pour mettre le projet sur GitHub

## Étape 1 : Configurer Git (si pas déjà fait)

```powershell
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

Ou pour ce projet uniquement (sans --global) :
```powershell
git config user.name "Votre Nom"
git config user.email "votre.email@example.com"
```

## Étape 2 : Créer le commit initial

```powershell
git commit -m "Initial commit: React Native app with Expo, Android, iOS and Web support"
```

## Étape 3 : Créer un dépôt sur GitHub

1. Allez sur https://github.com
2. Cliquez sur le bouton "+" en haut à droite
3. Sélectionnez "New repository"
4. Donnez un nom à votre dépôt (ex: "myapp")
5. Choisissez Public ou Private
6. **NE PAS** cocher "Initialize this repository with a README" (vous avez déjà un README)
7. Cliquez sur "Create repository"

## Étape 4 : Connecter votre dépôt local à GitHub

GitHub vous donnera des commandes, mais voici les commandes à exécuter :

```powershell
# Ajouter le remote GitHub (remplacez USERNAME et REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Ou si vous utilisez SSH :
# git remote add origin git@github.com:USERNAME/REPO_NAME.git

# Renommer la branche principale en 'main' (si nécessaire)
git branch -M main

# Pousser le code sur GitHub
git push -u origin main
```

## Commandes utiles pour la suite

```powershell
# Voir l'état des fichiers
git status

# Ajouter des fichiers modifiés
git add .

# Créer un commit
git commit -m "Description des changements"

# Pousser sur GitHub
git push

# Récupérer les dernières modifications
git pull
```

## Notes importantes

- Les fichiers sensibles (mots de passe, clés API, etc.) sont déjà dans `.gitignore`
- Ne jamais commiter les fichiers `node_modules/`, ils sont automatiquement ignorés
- Les fichiers de build (`android/app/build/`, etc.) sont aussi ignorés

