# Guide de débogage - Application ne s'ouvre pas

## Étapes de diagnostic

### 1. Vérifier les logs Metro/Expo
Regardez la console où Expo est lancé pour voir les erreurs.

### 2. Tester avec une version simplifiée
Temporairement, remplacez le contenu de `index.js` par :
```javascript
import { registerRootComponent } from 'expo';
import App from './App-test';

registerRootComponent(App);
```

### 3. Vérifier les dépendances
```bash
cd myapp
npm install
```

### 4. Nettoyer le cache
```bash
cd myapp
npx expo start --clear
```

### 5. Vérifier l'émulateur Android
```bash
adb devices
```
Assurez-vous qu'un appareil est listé.

### 6. Recompiler l'application
```bash
cd myapp
npx expo run:android
```

## Erreurs communes

1. **Erreur de bundle** : Le JavaScript ne se charge pas
   - Solution : `npx expo start --clear`

2. **Erreur de module** : Module manquant
   - Solution : `npm install`

3. **Erreur de rendu** : L'app crash au démarrage
   - Vérifiez les logs avec `adb logcat | grep -i "react\|error"`

4. **Port occupé** : Le port 8081 est utilisé
   - Solution : `npx expo start --port 8085`







