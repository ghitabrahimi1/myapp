/// <reference types="react-native/types" />

// Déclaration de module pour les fichiers d'images
declare module '*.png' {
  const value: number;
  export default value;
}

declare module '*.jpg' {
  const value: number;
  export default value;
}

declare module '*.jpeg' {
  const value: number;
  export default value;
}

declare module '*.gif' {
  const value: number;
  export default value;
}

declare module '*.webp' {
  const value: number;
  export default value;
}

// Types DOM pour le support web
declare global {
  interface Window {
    width?: number;
    height?: number;
  }
  
  var document: Document;
  var window: Window & typeof globalThis;
  
  // Extension de RequestInit pour supporter redirect
  interface RequestInit {
    redirect?: RequestRedirect;
  }
}
