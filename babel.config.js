module.exports = {
  presets: [
    [
      '@react-native/babel-preset',
      {
        // Désactiver les transformations qui peuvent causer des problèmes avec Hermes
        useTransformReactJSXExperimental: false,
      },
    ],
  ],
  // Assurer que les imports ne sont pas transformés en require() dynamique
  plugins: [],
};


