// Polyfill pour React Native - permet require uniquement pour les modules internes
if (typeof global !== 'undefined') {
  const originalRequire = global.require;
  
  // Garder require pour les modules React Native internes
  if (originalRequire) {
    // Ne pas modifier require si c'est celui de React Native
    return;
  }
  
  // Sinon, créer un require minimal qui ne fait rien
  global.require = function() {
    return {};
  };
}


