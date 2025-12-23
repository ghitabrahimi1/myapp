// Stub pour react-native-webview sur le web
// Ce module n'est pas supporté sur le web, donc nous retournons un composant vide

import React from 'react';
import { View, Text } from 'react-native';

const WebView = (props) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('WebView n\'est pas supporté sur le web. Utilisez une iframe ou une redirection.');
  }
  return (
    <View style={{ padding: 20, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
      <Text style={{ color: '#666' }}>
        WebView n'est pas disponible sur le web. Veuillez utiliser une redirection ou une iframe.
      </Text>
    </View>
  );
};

export default WebView;
export { WebView };


