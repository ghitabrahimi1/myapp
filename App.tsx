import React, { useState, useEffect, useRef } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, Animated, Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { AuthProvider, useAuth } from './myapp/context/AuthContext';
import RegisterScreen from './myapp/screens/RegisterScreen';
import HomeScreen from './myapp/screens/HomeScreen';
import PublicSearchScreen from './myapp/screens/PublicSearchScreen';
import { ErrorBoundary } from './myapp/components/ErrorBoundary';
import logoImage from './myapp/assets/images/logo.png';
import { authorizeRequest, tokenRequest } from './myapp/screens/LoginScreen';

function AppContent() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [logoImageSource, setLogoImageSource] = useState<number | null>(null);
  
  // Les hooks doivent être appelés de manière inconditionnelle
  const { isAuthenticated, username, login, logout } = useAuth();
  
  // Charger l'image avec expo-asset
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const asset = Asset.fromModule(logoImage);
        await asset.downloadAsync();
        setLogoImageSource(logoImage);
      } catch (error) {
        console.error('Erreur lors du chargement du logo:', error);
      }
    };
    loadLogo();
  }, []);
  const [localUsername, setLocalUsername] = useState('');
  const [localPassword, setLocalPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showPublicSearch, setShowPublicSearch] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  
  // Animations pour le background réactif
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;
  const animatedValue3 = useRef(new Animated.Value(0)).current;
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    // Initialiser l'application immédiatement pour éviter les blocages
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // Animation continue pour les cercles de fond (seulement si on affiche le login)
    if (showLogin) {
      const animate1 = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue1, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue1, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );

      const animate2 = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue2, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue2, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      );

      const animate3 = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue3, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue3, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
        ])
      );

      animate1.start();
      animate2.start();
      animate3.start();

      return () => {
        animate1.stop();
        animate2.stop();
        animate3.stop();
      };
    }
  }, [showLogin, animatedValue1, animatedValue2, animatedValue3]);

  const handleLogin = async () => {
    if (!localUsername.trim() || !localPassword.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      // Appeler la fonction authorizeRequest
      console.log('Appel de authorizeRequest depuis App.tsx...');
      const response = await authorizeRequest(localUsername, localPassword);
      
      // Vérifier le statut de la réponse
      if (response.status === 200) {
        console.log('Status 200 - Traitement de la réponse...');
        
        // Lire le body UNE SEULE FOIS comme texte
        const responseText = await response.text();
        console.log('Réponse body (status 200):', responseText);
        
        // Parser le JSON (la réponse est toujours JSON avec Location dans le body)
        try {
          const jsonData = JSON.parse(responseText);
          console.log('Réponse JSON:', jsonData);
          
          // Le Location est dans le body JSON, pas dans les headers HTTP
          if (jsonData.Location) {
            const location = jsonData.Location;
            console.log('Location depuis JSON:', location);
            
            try {
              const url = new URL(location);
              const code = url.searchParams.get('code');
              const state = url.searchParams.get('state');
              
              console.log('Code extrait:', code);
              console.log('State extrait:', state);
              
              if (code) {
                console.log('Échange du code contre un token...');
                // Échanger le code contre un token
                const tokenResponse = await tokenRequest(code);
                
                if (tokenResponse.status === 200) {
                  // Lire le body UNE SEULE FOIS
                  const tokenResponseText = await tokenResponse.text();
                  console.log('Réponse token body:', tokenResponseText);
                  
                  try {
                    const tokenData = JSON.parse(tokenResponseText);
                    console.log('Token data:', tokenData);
                    
                    // Extraire le token depuis la réponse
                    // La réponse OAuth2 standard contient access_token
                    let accessToken: string | null = null;
                    
                    if (tokenData.access_token) {
                      // Token OAuth2 standard
                      accessToken = tokenData.access_token;
                      console.log('Token OAuth2 trouvé (access_token)');
                    } else if (tokenData.token) {
                      // Format alternatif
                      accessToken = tokenData.token;
                      console.log('Token trouvé (token)');
                    } else if (tokenData.Location) {
                      // Si Location est présent, cela peut être une redirection avec un nouveau code
                      const locationUrl = new URL(tokenData.Location);
                      const newCode = locationUrl.searchParams.get('code');
                      console.log('Nouveau code depuis Location:', newCode);
                      // Ne pas utiliser le code comme token, essayer une nouvelle requête token
                      if (newCode) {
                        console.log('Nouveau code reçu, nouvelle requête token...');
                        const newTokenResponse = await tokenRequest(newCode);
                        if (newTokenResponse.status === 200) {
                          const newTokenText = await newTokenResponse.text();
                          const newTokenData = JSON.parse(newTokenText);
                          if (newTokenData.access_token) {
                            accessToken = newTokenData.access_token;
                            console.log('Token obtenu depuis nouveau code');
                          }
                        }
                      }
                    }
                    
                    if (!accessToken) {
                      console.error('Aucun token valide trouvé dans la réponse');
                      Alert.alert('Erreur', 'Token d\'accès non reçu du serveur. Veuillez réessayer.');
                      setLoading(false);
                      return;
                    }
                    
                    console.log('Token final:', accessToken.substring(0, 20) + '...');
                    console.log('Appel de login avec le token...');
                    await login(localUsername, localPassword, accessToken);
                    console.log('Login réussi! Redirection vers HomeScreen...');
                    setShowLogin(false);
                    setShowPublicSearch(false);
                    return;
                  } catch (tokenError) {
                    console.error('Erreur parsing token response:', tokenError);
                    Alert.alert('Erreur', 'Erreur lors du traitement de la réponse du token');
                  }
                } else {
                  // Lire le body UNE SEULE FOIS pour les erreurs
                  let errorText = '';
                  try {
                    errorText = await tokenResponse.text();
                  } catch (e) {
                    errorText = `Erreur ${tokenResponse.status}`;
                  }
                  console.error('Erreur token request:', tokenResponse.status, errorText);
                  Alert.alert('Erreur', `Erreur lors de l'échange du code: ${tokenResponse.status} - ${errorText}`);
                }
              } else {
                Alert.alert('Erreur', 'Code d\'autorisation non trouvé dans Location');
              }
            } catch (urlError) {
              console.error('Erreur parsing URL:', urlError);
              Alert.alert('Erreur', 'Erreur lors du parsing de l\'URL de redirection');
            }
          } else if (jsonData.code) {
            // Si le code est directement dans le JSON (fallback)
            const code = jsonData.code;
            console.log('Code extrait directement du JSON:', code);
            
            // Échanger le code contre un token
            console.log('Échange du code contre un token...');
            const tokenResponse = await tokenRequest(code);
            
            if (tokenResponse.status === 200) {
              // Lire le body UNE SEULE FOIS
              const tokenResponseText = await tokenResponse.text();
              console.log('Réponse token body:', tokenResponseText);
              
              try {
                const tokenData = JSON.parse(tokenResponseText);
                console.log('Token data:', tokenData);
                
                let accessToken: string | null = null;
                
                if (tokenData.access_token) {
                  // Token OAuth2 standard
                  accessToken = tokenData.access_token;
                  console.log('Token OAuth2 trouvé (access_token)');
                } else if (tokenData.token) {
                  // Format alternatif
                  accessToken = tokenData.token;
                  console.log('Token trouvé (token)');
                } else if (tokenData.Location) {
                  // Si Location est présent, essayer une nouvelle requête token
                  const locationUrl = new URL(tokenData.Location);
                  const newCode = locationUrl.searchParams.get('code');
                  if (newCode) {
                    console.log('Nouveau code reçu, nouvelle requête token...');
                    const newTokenResponse = await tokenRequest(newCode);
                    if (newTokenResponse.status === 200) {
                      const newTokenText = await newTokenResponse.text();
                      const newTokenData = JSON.parse(newTokenText);
                      if (newTokenData.access_token) {
                        accessToken = newTokenData.access_token;
                        console.log('Token obtenu depuis nouveau code');
                      }
                    }
                  }
                }
                
                if (!accessToken) {
                  console.error('Aucun token valide trouvé dans la réponse');
                  Alert.alert('Erreur', 'Token d\'accès non reçu du serveur. Veuillez réessayer.');
                  setLoading(false);
                  return;
                }
                
                console.log('Token final:', accessToken.substring(0, 20) + '...');
                await login(localUsername, localPassword, accessToken);
                setShowLogin(false);
                setShowPublicSearch(false);
                return;
              } catch (tokenError) {
                console.error('Erreur parsing token response:', tokenError);
                Alert.alert('Erreur', 'Erreur lors du traitement de la réponse du token');
              }
            } else {
              // Lire le body UNE SEULE FOIS pour les erreurs
              let errorText = '';
              try {
                errorText = await tokenResponse.text();
              } catch (e) {
                errorText = `Erreur ${tokenResponse.status}`;
              }
              console.error('Erreur token request:', tokenResponse.status, errorText);
              Alert.alert('Erreur', `Erreur lors de l'échange du code: ${tokenResponse.status} - ${errorText}`);
            }
          } else {
            console.error('Aucun Location ou code trouvé dans la réponse JSON:', jsonData);
            Alert.alert('Erreur', 'Code d\'autorisation non trouvé dans la réponse');
          }
        } catch (jsonError) {
          console.error('Erreur parsing JSON:', jsonError);
          Alert.alert('Erreur', 'Erreur lors du parsing de la réponse JSON');
        }
      } else if (response.status === 302 || response.status === 301 || response.status === 307 || response.status === 308) {
        // Récupérer l'URL de redirection depuis le header Location
        const location = response.headers.get('Location');
        
        if (location) {
          console.log('Location header:', location);
          
          // Convertir l'URL relative en absolue si nécessaire
          let fullLocation = location;
          if (!location.startsWith('http://') && !location.startsWith('https://')) {
            fullLocation = `https://dev.atline-services.com${location.startsWith('/') ? '' : '/'}${location}`;
          }
          
          // Extraire le code depuis l'URL de redirection
          const url = new URL(fullLocation);
          const code = url.searchParams.get('code');
          const state = url.searchParams.get('state');
          
          console.log('Extracted code:', code, 'state:', state);
          
          if (code) {
            // Échanger le code contre un token avant de se connecter
            console.log('Échange du code contre un token depuis redirection 302...');
            const tokenResponse = await tokenRequest(code);
            
            if (tokenResponse.status === 200) {
              // Lire le body UNE SEULE FOIS
              const tokenResponseText = await tokenResponse.text();
              try {
                const tokenData = JSON.parse(tokenResponseText);
                let accessToken: string | null = null;
                
                if (tokenData.access_token) {
                  accessToken = tokenData.access_token;
                } else if (tokenData.token) {
                  accessToken = tokenData.token;
                }
                
                if (accessToken) {
                  console.log('Token obtenu depuis redirection 302');
                  await login(localUsername, localPassword, accessToken);
                  setShowLogin(false);
                  setShowPublicSearch(false);
                } else {
                  Alert.alert('Erreur', 'Token d\'accès non reçu du serveur');
                }
              } catch (error) {
                console.error('Erreur parsing token:', error);
                Alert.alert('Erreur', 'Erreur lors du traitement du token');
              }
            } else {
              // Lire le body UNE SEULE FOIS pour les erreurs
              let errorText = '';
              try {
                errorText = await tokenResponse.text();
              } catch (e) {
                errorText = `Erreur ${tokenResponse.status}`;
              }
              Alert.alert('Erreur', `Erreur lors de l'échange du code: ${tokenResponse.status} - ${errorText}`);
            }
          } else {
            Alert.alert('Erreur', 'Code d\'autorisation non reçu dans la redirection');
          }
        } else {
          Alert.alert('Erreur', 'Header Location manquant dans la réponse');
        }
      } else {
        // Si ce n'est pas une redirection, essayer de lire le body pour voir l'erreur
        const text = await response.text();
        console.error('Erreur réponse:', response.status, text);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        Alert.alert('Erreur', `Erreur d'authentification: ${response.status} - ${text}`);
      }
    } catch (error: any) {
      console.error('Erreur login:', error);
      Alert.alert('Erreur', error.message || 'Échec de la connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return (
      <RegisterScreen
        onBack={() => setShowRegister(false)}
        onRegister={() => {
          setShowRegister(false);
        }}
      />
    );
  }

  // Ne pas utiliser LoginScreen, utiliser l'interface intégrée ci-dessous

  if (isAuthenticated && username) {
    return (
      <HomeScreen
        username={username}
        onLogout={async () => {
          await logout();
          setShowPublicSearch(true);
        }}
      />
    );
  }

  // Afficher un écran de chargement pendant l'initialisation
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <Text style={{ fontSize: 18, color: '#1a237e', marginBottom: 10 }}>Chargement...</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>Veuillez patienter</Text>
      </View>
    );
  }

  if (showPublicSearch) {
    return (
      <PublicSearchScreen
        onLogin={() => {
          setShowPublicSearch(false);
          setShowLogin(true);
        }}
        isLoggedIn={isAuthenticated}
      />
    );
  }

  if (showLogin) {
    // Afficher l'interface de login intégrée avec "My space"
    // Interpolations pour les animations
    const translateY1 = animatedValue1.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -30],
    });

    const translateX1 = animatedValue1.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 20],
    });

    const scale1 = animatedValue1.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2],
    });

    const translateY2 = animatedValue2.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 25],
    });

    const translateX2 = animatedValue2.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -15],
    });

    const scale2 = animatedValue2.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.15],
    });

    const translateY3 = animatedValue3.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -20],
    });

    const translateX3 = animatedValue3.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10],
    });

    const opacity1 = animatedValue1.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.6],
    });

    const opacity2 = animatedValue2.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 0.5],
    });

    const opacity3 = animatedValue3.interpolate({
      inputRange: [0, 1],
      outputRange: [0.25, 0.55],
    });

  return (
    <View style={styles.loginContainer}>
      {/* Background réactif animé */}
      <View style={styles.backgroundContainer}>
        <Animated.View
          style={[
            styles.animatedCircle,
            styles.circle1,
            {
              transform: [
                { translateY: translateY1 },
                { translateX: translateX1 },
                { scale: scale1 },
              ],
              opacity: opacity1,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.animatedCircle,
            styles.circle2,
            {
              transform: [
                { translateY: translateY2 },
                { translateX: translateX2 },
                { scale: scale2 },
              ],
              opacity: opacity2,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.animatedCircle,
            styles.circle3,
            {
              transform: [
                { translateY: translateY3 },
                { translateX: translateX3 },
              ],
              opacity: opacity3,
            },
          ]}
        />
      </View>

      {/* Contenu par-dessus le background */}
      <View style={styles.contentOverlay}>
        {/* Logo en haut à droite */}
        <View style={styles.logoContainer}>
          {logoImageSource && (
            <Image 
              source={logoImageSource} 
              style={styles.logo}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Titre "My space" avec accent orange */}
        <View style={styles.titleContainer}>
          <Text style={styles.loginTitle}>My </Text>
          <Text style={styles.loginTitleOrange}>space</Text>
          <View style={styles.titleUnderline} />
        </View>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.labelContainer}>
              <View style={styles.labelIconOrange}>
                <Text style={styles.labelIconText}>👤</Text>
              </View>
              <Text style={styles.label}>Username</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  usernameFocused && styles.inputFocused
                ]}
                placeholder=""
                value={localUsername}
                onChangeText={setLocalUsername}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
                autoCapitalize="none"
              />
              {usernameFocused && (
                <View style={styles.inputGlow} />
              )}
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.labelContainer}>
              <View style={styles.labelIconOrange}>
                <Text style={styles.labelIconText}>🔒</Text>
              </View>
              <Text style={styles.label}>Password</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  passwordFocused && styles.inputFocused,
                  styles.passwordInput
                ]}
                placeholder=""
                secureTextEntry={!showPassword}
                value={localPassword}
                onChangeText={setLocalPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                textContentType="password"
                returnKeyType="done"
                autoComplete="password"
                enablesReturnKeyAutomatically={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
              {passwordFocused && (
                <View style={styles.inputGlow} pointerEvents="none" />
              )}
            </View>
          </View>

          {/* Remember me checkbox */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Remember me</Text>
          </TouchableOpacity>

          {/* Bouton LOGIN high-tech orange */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.loginButtonGlow} />
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>
                {loading ? 'CONNEXION...' : 'LOGIN'}
              </Text>
              <Text style={styles.loginButtonArrow}>→</Text>
            </View>
            <View style={styles.loginButtonBorder} />
          </TouchableOpacity>

          {/* Lien forgotten password avec accent orange */}
          <TouchableOpacity style={styles.forgotPasswordContainer} activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>forgotten password?</Text>
            <View style={styles.forgotPasswordUnderline} />
          </TouchableOpacity>

          {/* Bouton create account */}
          <TouchableOpacity 
            style={styles.createAccountButton}
            onPress={() => setShowRegister(true)}
          >
            <Text style={styles.createAccountText}>Tenderer create a free account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  }

  // Fallback: afficher PublicSearchScreen par défaut si aucune condition n'est remplie
  return (
    <PublicSearchScreen
      onLogin={() => {
        setShowPublicSearch(false);
        setShowLogin(true);
      }}
      isLoggedIn={isAuthenticated}
    />
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 60,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    backgroundColor: '#fafbfc',
  },
  animatedCircle: {
    position: 'absolute',
    borderRadius: 1000,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(26, 35, 126, 0.03)',
    top: -100,
    right: -100,
  },
  circle2: {
    width: 250,
    height: 250,
    backgroundColor: 'rgba(57, 73, 171, 0.03)',
    bottom: 50,
    left: -50,
  },
  circle3: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(92, 107, 192, 0.03)',
    top: '35%',
    right: 30,
  },
  contentOverlay: {
    flex: 1,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  titleContainer: {
    marginBottom: 40,
    position: 'relative',
  },
  loginTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1a237e',
    letterSpacing: 1,
  },
  loginTitleOrange: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ff9800',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 152, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleUnderline: {
    width: 100,
    height: 4,
    backgroundColor: '#ff9800',
    marginTop: 8,
    borderRadius: 2,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  labelIconOrange: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff9800',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  labelIconText: {
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a237e',
    letterSpacing: 0.5,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
  },
  input: {
    borderWidth: 3,
    borderColor: '#1a237e',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    fontWeight: '500',
    flex: 1,
  },
  passwordInput: {
    paddingRight: 50,
    minHeight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -18,
    padding: 8,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  eyeIcon: {
    fontSize: 20,
  },
  inputFocused: {
    borderColor: '#ff9800',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  inputGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    zIndex: -1,
    pointerEvents: 'none',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#1a237e',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1a237e',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#ff9800',
    borderRadius: 12,
    padding: 0,
    marginBottom: 15,
    overflow: 'visible',
    position: 'relative',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 12,
  },
  loginButtonGlow: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 152, 0, 0.3)',
    zIndex: -1,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loginButtonArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  loginButtonBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff6f00',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#ff9800',
    fontWeight: '600',
  },
  forgotPasswordUnderline: {
    position: 'absolute',
    bottom: -4,
    width: 140,
    height: 2,
    backgroundColor: '#ff9800',
    borderRadius: 1,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  separatorText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  createAccountButton: {
    borderWidth: 2,
    borderColor: '#1a237e',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createAccountText: {
    color: '#1a237e',
    fontSize: 14,
    fontWeight: '600',
  },
});
