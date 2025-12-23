/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './App';
import { name as appName } from './app.json';

// Pour le web, utiliser AppRegistry directement
if (Platform.OS === 'web') {
  AppRegistry.registerComponent(appName, () => App);
  
  // Lancer l'application sur le web
  const startApp = () => {
    const rootTag = document.getElementById('root');
    if (rootTag) {
      AppRegistry.runApplication(appName, {
        initialProps: {},
        rootTag,
      });
    }
  };
  
  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', startApp);
    } else {
      startApp();
    }
  }
} else {
  // Pour mobile, utiliser registerRootComponent d'Expo
  registerRootComponent(App);
}
