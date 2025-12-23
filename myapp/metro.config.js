const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Désactiver les exports de package instables pour éviter l'erreur require
config.resolver.unstable_enablePackageExports = false;

// Exclure crypto-js complètement du bundler
config.resolver.blockList = [
  /node_modules\/crypto-js\/.*/,
];

// Configuration pour transformer require en import
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: true,
      inlineRequires: true,
    },
  }),
};

module.exports = config;
