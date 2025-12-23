import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OAUTH2_CONFIG } from '../config/oauth2';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string, code?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier le statut d'authentification avec un petit délai pour éviter les problèmes de timing
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedAuth = await AsyncStorage.getItem('isAuthenticated');
      const storedToken = await AsyncStorage.getItem('access_token');
      
      if (storedAuth === 'true' && storedUsername && storedToken) {
        setUsername(storedUsername);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Error checking auth status - continuer sans bloquer l'application
      console.error('Erreur lors de la vérification du statut d\'authentification:', error);
    }
  };

  const login = async (username: string, password: string, token?: string) => {
    try {
      // Validation
      if (!username || !password) {
        throw new Error('Nom d\'utilisateur et mot de passe requis');
      }

      // Un token OAuth2 valide est requis pour se connecter
      if (!token) {
        throw new Error('Token d\'authentification requis. Veuillez vous reconnecter.');
      }
      
      // Vérifier que le token n'est pas un token de fallback
      if (token.startsWith('token_')) {
        throw new Error('Token d\'authentification invalide. Veuillez vous reconnecter.');
      }
      
      // Stocker le token reçu du serveur
      await AsyncStorage.setItem('access_token', token);
      await AsyncStorage.setItem('token_type', 'Bearer');
      await AsyncStorage.setItem('token_expires_in', '3600');
      
      // Stocker le username et le statut d'authentification
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('isAuthenticated', 'true');
      
      setUsername(username);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Erreur login:', error);
      throw error;
    }
  };


  const logout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('isAuthenticated');
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('token_type');
      await AsyncStorage.removeItem('token_expires_in');
      
      setUsername(null);
      setIsAuthenticated(false);
    } catch (error) {
      // Logout error
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}














