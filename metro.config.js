const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    ...defaultConfig.transformer,
    // Désactiver inlineRequires pour éviter l'injection de require() au runtime
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    // Désactiver require.context qui n'est pas supporté par Hermes
    unstable_allowRequireContext: false,
  },
  resolver: {
    ...defaultConfig.resolver,
    // Désactiver les exports de package instables qui peuvent causer des problèmes avec require()
    unstable_enablePackageExports: false,
    // Ajouter le dossier myapp aux sources pour résoudre les imports
    sourceExts: [...defaultConfig.resolver.sourceExts, 'tsx', 'ts'],
  },
  watchFolders: [
    __dirname,
    require('path').resolve(__dirname, 'myapp'),
  ],
};

module.exports = mergeConfig(defaultConfig, config);


