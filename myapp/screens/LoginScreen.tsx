import React, { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';
import sha256 from '../utils/sha256';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import logoImage from '../assets/images/logo.png';


interface LoginScreenProps {
  onLogin: (username: string, password: string, code?: string) => void;
}

export async function authorizeRequest(login: string, password: string) {
  console.log('=== authorizeRequest DEBUG ===');
  console.log('Login:', login);
  console.log('Password (non hashé):', password);
  
  const today = new Date().toISOString().split('T')[0];
  console.log('Date du jour:', today);
  
  const passwordToHash = password + today;
  console.log('String à hasher:', passwordToHash);
  
  const hashedPassword = sha256(passwordToHash);
  console.log('Password hashé complet:', hashedPassword);
  console.log('Longueur du hash:', hashedPassword.length);

  // Construire les paramètres dans l'ordre exact requis
  const params = new URLSearchParams();
  params.append('response_type', 'code');
  params.append('client_id', 'atline-services');
  params.append('redirect_uri', 'https://dev.atline-services.com/');
  params.append('state', 'login');
  params.append('login', login);
  params.append('password', hashedPassword);
  
  const body = params.toString();
  
  console.log('Paramètres:', {
    response_type: 'code',
    client_id: 'atline-services',
    redirect_uri: 'https://dev.atline-services.com/',
    state: 'login',
    login: login,
    password: hashedPassword.substring(0, 20) + '...',
  });
  console.log('Body complet:', body);

  console.log('Envoi de la requête POST vers https://wspp.atline.fr/authorize');

  const response = await fetch('https://wspp.atline.fr/authorize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
    redirect: 'manual',
  });

  console.log('Réponse fetch:', response.status, response.statusText);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
  // Ne pas lire le body ici, laisser App.tsx le faire si nécessaire
  console.log('=== FIN DEBUG ===');
  
  return response;
}

export async function tokenRequest(code: string) {
  console.log('=== tokenRequest DEBUG ===');
  console.log('Code reçu:', code);
  
  // Construire les paramètres pour l'échange du code contre un token
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', 'atline-services');
  params.append('client_secret', '22360C1B138EA4EA935F1B28FB1B16CB');
  params.append('code', code);
  params.append('redirect_uri', 'https://dev.atline-services.com/');
  
  const body = params.toString();
  
  console.log('Paramètres token:', {
    grant_type: 'authorization_code',
    client_id: 'atline-services',
    client_secret: '22360C1B138EA4EA935F1B28FB1B16CB',
    code: code,
    redirect_uri: 'https://dev.atline-services.com/',
  });
  console.log('Body complet:', body);
  
  console.log('Envoi de la requête POST vers https://wspp.atline.fr/token');
  
  const response = await fetch('https://wspp.atline.fr/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
    redirect: 'manual',
  });
  
  console.log('Réponse token fetch:', response.status, response.statusText);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  console.log('=== FIN DEBUG tokenRequest ===');
  
  return response;
}

export interface ConsultationListParams {
  cle_etab: string;
  etat?: string;
  sem?: number;
  useUnpublished?: boolean; // Si true, utilise unpublished_consultations_list pour les consultations nouvelles
  pagination?: {
    page?: number;
    nbr_par_page?: number;
    ordre?: string;
    sens_ordre?: string;
  };
}

export interface Consultation {
  cle_dce: string;
  etat: number;
  identifiant: string;
  ref_interne: string;
  objet: string;
  cle_pa: string;
  denomination_pa: string;
  cle_etab: string;
  finalite_marche: string;
  type_marche: string;
  type_marche_label: string;
  type_prestation: string;
  type_pa: string;
  date_creation: number;
  date_creation_f: string;
  date_publication: number;
  date_publication_f: string;
  date_cloture: number;
  date_cloture_f: string;
  departements_prestation: string;
  emails: string;
  emails_oe: string;
  emails_oe_alias: string;
  emails_oe_comp: string;
  mail_auto: number;
  passation: string;
  passation_label: string | null;
  allotie: number;
  informatique: number;
  en_ligne: number;
  invisible: number;
  restreinte: string | null;
  passe: string;
  option_reponse: string | null;
  option_reponse_f: string | null;
  format_reponse: string | null;
  signature_obligatoire: string | null;
  format_signature: string | null;
  structure_interne: string | null;
  criteres_environnementaux: number;
  criteres_sociaux: number;
  publication: number;
  is_dume: number;
  prix_dce: number;
  libre_ms: number;
  infos_tarifs: string;
  cle_affaire: string;
  cle_affaire_lib: string | null;
  pays: string;
  nb_retrait: number | null;
  nb_retrait_papier: number | null;
  nb_depot: number | null;
  nb_depot_papier: number | null;
  id_dume: string | null;
  type_dume: string | null;
  cle_groupe: string | null;
  nb_lots: number;
}

export interface ConsultationListResponse {
  consultations: Consultation[];
  nb_total: number;
  pagination: {
    page: number;
    nbr_par_page: number;
    ordre: string;
    sens_ordre: string;
  };
}

export async function getConsultationsList(
  token: string,
  params: ConsultationListParams
): Promise<ConsultationListResponse> {
  console.log('=== getConsultationsList DEBUG ===');
  console.log('Token:', token.substring(0, 20) + '...');
  console.log('Paramètres:', params);
  
  // Construire le body JSON avec les paramètres
  const body: any = {
    cle_etab: params.cle_etab,
  };
  
  if (params.etat !== undefined) {
    body.etat = params.etat;
  }
  
  if (params.sem !== undefined) {
    body.sem = params.sem;
  }
  
  if (params.pagination) {
    body.pagination = {
      page: params.pagination.page ?? 1,
      nbr_par_page: params.pagination.nbr_par_page ?? 10,
      ordre: params.pagination.ordre ?? 'date_creation',
      sens_ordre: params.pagination.sens_ordre ?? 'DESC',
    };
  } else {
    // Valeurs par défaut pour la pagination
    body.pagination = {
      page: 1,
      nbr_par_page: 10,
      ordre: 'date_creation',
      sens_ordre: 'DESC',
    };
  }
  
  console.log('Body JSON:', JSON.stringify(body, null, 2));
  
  // Déterminer l'URL selon le type de consultation
  const baseUrl = params.useUnpublished 
    ? 'https://wsp.atline.fr/unpublished_consultations_list'
    : 'https://wspp.atline.fr/consultations_list';
  
  console.log('URL de base:', baseUrl);
  console.log('useUnpublished:', params.useUnpublished);
  
  // Essayer d'abord GET avec les paramètres dans l'URL
  const urlParams = new URLSearchParams();
  urlParams.append('cle_etab', body.cle_etab);
  if (body.etat) urlParams.append('etat', body.etat);
  if (body.sem !== undefined) urlParams.append('sem', body.sem.toString());
  if (body.pagination) {
    urlParams.append('pagination[page]', body.pagination.page.toString());
    urlParams.append('pagination[nbr_par_page]', body.pagination.nbr_par_page.toString());
    urlParams.append('pagination[ordre]', body.pagination.ordre);
    urlParams.append('pagination[sens_ordre]', body.pagination.sens_ordre);
  }
  
  const urlWithParams = `${baseUrl}?${urlParams.toString()}`;
  console.log('Tentative 1: Envoi de la requête GET vers', urlWithParams);
  
  let response = await fetch(urlWithParams, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });
  
  // Si GET retourne 405, essayer POST avec JSON
  if (response.status === 405) {
    console.log('GET non autorisé (405), essai avec POST + JSON...');
    response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
  
  // Si POST avec JSON retourne aussi 405, essayer POST avec form-urlencoded
  if (response.status === 405) {
    console.log('POST + JSON non autorisé (405), essai avec POST + form-urlencoded...');
    const formData = new URLSearchParams();
    formData.append('cle_etab', body.cle_etab);
    if (body.etat) formData.append('etat', body.etat);
    if (body.sem !== undefined) formData.append('sem', body.sem.toString());
    if (body.pagination) {
      formData.append('pagination[page]', body.pagination.page.toString());
      formData.append('pagination[nbr_par_page]', body.pagination.nbr_par_page.toString());
      formData.append('pagination[ordre]', body.pagination.ordre);
      formData.append('pagination[sens_ordre]', body.pagination.sens_ordre);
    }
    
    response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });
  }
  
  console.log('Réponse consultations fetch:', response.status, response.statusText);
  
  if (!response.ok) {
    let errorText = '';
    let errorData: any = null;
    
    try {
      errorText = await response.text();
      // Essayer de parser comme JSON si possible
      try {
        errorData = JSON.parse(errorText);
      } catch {
        // Si ce n'est pas du JSON, utiliser le texte brut
      }
    } catch (e) {
      errorText = 'Erreur inconnue';
    }
    
    console.error('Erreur récupération consultations:', response.status, errorText);
    
    // Gérer spécifiquement les erreurs de token invalide
    if (response.status === 401 || response.status === 403) {
      const errorMessage = errorData?.error_description || errorData?.detail || errorData?.error || errorText;
      if (errorMessage.toLowerCase().includes('token') || errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('unauthorized')) {
        throw new Error('Token d\'authentification invalide ou expiré. Veuillez vous reconnecter.');
      }
    }
    
    // Message d'erreur générique avec les détails
    const errorMessage = errorData?.error_description || errorData?.detail || errorData?.error || errorText || `Erreur ${response.status}`;
    throw new Error(`Erreur lors de la récupération des consultations: ${errorMessage}`);
  }
  
  let data: ConsultationListResponse;
  try {
    const jsonData = await response.json();
    
    // Valider la structure de la réponse
    if (!jsonData || typeof jsonData !== 'object') {
      throw new Error('Réponse invalide de l\'API: format de données incorrect');
    }
    
    if (!Array.isArray(jsonData.consultations)) {
      throw new Error('Réponse invalide de l\'API: consultations manquantes ou invalides');
    }
    
    // S'assurer que les champs requis sont présents avec des valeurs par défaut
    data = {
      consultations: jsonData.consultations || [],
      nb_total: jsonData.nb_total || jsonData.consultations?.length || 0,
      pagination: jsonData.pagination || {
        page: 1,
        nbr_par_page: 10,
        ordre: 'date_creation',
        sens_ordre: 'DESC'
      }
    };
    
    console.log('✅ Consultations reçues:', data.consultations.length, 'sur', data.nb_total);
    console.log('=== FIN DEBUG getConsultationsList ===');
  } catch (parseError: any) {
    console.error('Erreur lors du parsing de la réponse JSON:', parseError);
    throw new Error(`Erreur lors du traitement de la réponse: ${parseError.message}`);
  }
  
  return data;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [logoImageSource, setLogoImageSource] = useState<number | null>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  // Charger l'image avec expo-asset
  React.useEffect(() => {
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
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de pulsation pour les cercles orange
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation de rotation pour les éléments décoratifs
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    console.log('handleLogin appelé avec:', username);
    setLoading(true);
    try {
      // Appeler la fonction authorizeRequest
      console.log('Appel de authorizeRequest...');
      const response = await authorizeRequest(username, password);
      console.log('Réponse reçue:', response.status, response.statusText);
      
      // Vérifier le statut de la réponse
      if (response.status === 302 || response.status === 301 || response.status === 307 || response.status === 308) {
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
            // Appeler onLogin avec le code pour compléter l'authentification
            await onLogin(username, password, code);
          } else {
            Alert.alert('Erreur', 'Code d\'autorisation non reçu dans la redirection');
          }
        } else {
          Alert.alert('Erreur', 'Header Location manquant dans la réponse');
        }
      } else {
        // Si ce n'est pas une redirection, essayer de lire le body pour voir l'erreur
        const text = await response.text();
        Alert.alert('Erreur', `Erreur d'authentification: ${response.status} - ${text}`);
      }
    } catch (error: any) {
      console.error('Erreur login:', error);
      Alert.alert('Erreur', error.message || 'Échec de la connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scaleInterpolate = pulseAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [1, 1.2, 1],
  });

  return (
    <View style={styles.container}>
      {/* Fond avec dégradé orange/bleu */}
      <View style={styles.gradientBackground}>
        <View style={styles.gradientLayer1} />
        <View style={styles.gradientLayer2} />
        <View style={styles.orangeOverlay} />
      </View>
      
      {/* Cercles décoratifs orange animés */}
      <Animated.View 
        style={[
          styles.decorativeCircle1,
          {
            transform: [{ scale: scaleInterpolate }],
          },
        ]} 
      />
      <Animated.View 
        style={[
          styles.decorativeCircle2,
          {
            transform: [{ scale: scaleInterpolate }],
          },
        ]} 
      />
      <Animated.View 
        style={[
          styles.decorativeCircle3,
          {
            transform: [{ rotate: rotateInterpolate }],
          },
        ]} 
      />
      
      {/* Lignes décoratives orange */}
      <View style={styles.orangeLine1} />
      <View style={styles.orangeLine2} />
      <View style={styles.orangeLine3} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Logo et Header avec accents orange */}
              <View style={styles.header}>
                <View style={styles.logoWrapper}>
                  <View style={styles.orangeGlow} />
                  <View style={styles.logoContainer}>
                    <View style={styles.orangeCorner1} />
                    <View style={styles.orangeCorner2} />
                    <View style={styles.orangeCorner3} />
                    <View style={styles.orangeCorner4} />
                    {logoImageSource && (
                      <Image 
                        source={logoImageSource} 
                        style={styles.logo}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Marchés</Text>
                  <Text style={styles.titleOrange}>Sécurisés</Text>
                </View>
                <View style={styles.titleUnderlineContainer}>
                  <View style={styles.titleUnderline} />
                  <View style={styles.titleUnderlineDot} />
                </View>
                <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
              </View>

              {/* Carte de login avec bordure orange épaisse */}
              <View style={styles.loginCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderGradient} />
                  <View style={styles.cardHeaderPattern}>
                    <View style={styles.patternDot} />
                    <View style={styles.patternDot} />
                    <View style={styles.patternDot} />
                    <View style={styles.patternDot} />
                    <View style={styles.patternDot} />
                  </View>
                </View>
                
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <View style={styles.labelContainer}>
                      <View style={styles.labelIconBg}>
                        <Text style={styles.labelIcon}>👤</Text>
                      </View>
                      <Text style={styles.label}>
                        Identifiant
                      </Text>
                    </View>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={[
                          styles.input,
                          usernameFocused && styles.inputFocused
                        ]}
                        placeholder="Entrez votre identifiant"
                        placeholderTextColor="#999"
                        value={username}
                        onChangeText={setUsername}
                        onFocus={() => setUsernameFocused(true)}
                        onBlur={() => setUsernameFocused(false)}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      {usernameFocused && <View style={styles.inputOrangeIndicator} />}
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <View style={styles.labelContainer}>
                      <View style={styles.labelIconBg}>
                        <Text style={styles.labelIcon}>🔒</Text>
                      </View>
                      <Text style={styles.label}>
                        Mot de passe
                      </Text>
                    </View>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={[
                          styles.input,
                          passwordFocused && styles.inputFocused
                        ]}
                        placeholder="Entrez votre mot de passe"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={true}
                        keyboardType="default"
                        returnKeyType="done"
                        testID="password-input"
                      />
                      {passwordFocused && (
                        <View 
                          style={[styles.inputOrangeIndicator, { pointerEvents: 'none' }]} 
                        />
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <View style={styles.loginButtonGradient}>
                      <View style={styles.buttonGlow} />
                      <Text style={styles.loginButtonText}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                      </Text>
                      <View style={styles.buttonArrow}>→</View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
                    <Text style={styles.forgotPasswordText}>
                      Mot de passe oublié ?
                    </Text>
                    <View style={styles.forgotPasswordUnderline} />
                  </TouchableOpacity>
                </View>
                
                {/* Bordure orange décorative */}
                <View style={styles.cardOrangeBorder} />
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a237e',
    opacity: 0.9,
  },
  gradientLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#283593',
    opacity: 0.6,
  },
  orangeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    top: -80,
    right: -80,
    borderWidth: 2,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 152, 0, 0.15)',
    bottom: 80,
    left: -40,
    borderWidth: 2,
    borderColor: 'rgba(255, 152, 0, 0.25)',
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 152, 0, 0.25)',
    top: '35%',
    right: 30,
    borderWidth: 3,
    borderColor: 'rgba(255, 152, 0, 0.4)',
  },
  orangeLine1: {
    position: 'absolute',
    width: 4,
    height: 150,
    backgroundColor: '#ff9800',
    top: '20%',
    left: 0,
    opacity: 0.6,
  },
  orangeLine2: {
    position: 'absolute',
    width: 150,
    height: 4,
    backgroundColor: '#ff9800',
    top: '25%',
    left: 0,
    opacity: 0.5,
  },
  orangeLine3: {
    position: 'absolute',
    width: 4,
    height: 100,
    backgroundColor: '#ff9800',
    bottom: '15%',
    right: 0,
    opacity: 0.6,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 32,
  },
  orangeGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 152, 0, 0.3)',
    top: -15,
    left: -15,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#ff9800',
    position: 'relative',
    overflow: 'hidden',
  },
  orangeCorner1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    backgroundColor: '#ff9800',
    borderBottomRightRadius: 20,
  },
  orangeCorner2: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: '#ff9800',
    borderBottomLeftRadius: 20,
  },
  orangeCorner3: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    backgroundColor: '#ff9800',
    borderTopRightRadius: 20,
  },
  orangeCorner4: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: '#ff9800',
    borderTopLeftRadius: 20,
  },
  logo: {
    width: 75,
    height: 75,
    zIndex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  titleOrange: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ff9800',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(255, 152, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  titleUnderlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 8,
  },
  titleUnderline: {
    width: 100,
    height: 5,
    backgroundColor: '#ff9800',
    borderRadius: 3,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  titleUnderlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff9800',
  },
  subtitle: {
    fontSize: 17,
    color: '#e0e0e0',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 0,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
    overflow: 'visible',
    borderWidth: 3,
    borderColor: '#ff9800',
    position: 'relative',
  },
  cardOrangeBorder: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: 'rgba(255, 152, 0, 0.3)',
    zIndex: -1,
  },
  cardHeader: {
    height: 12,
    backgroundColor: '#ff9800',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeaderGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ff9800',
  },
  cardHeaderPattern: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: 8,
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    opacity: 0.8,
  },
  form: {
    width: '100%',
    padding: 36,
  },
  inputContainer: {
    marginBottom: 28,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  labelIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff9800',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  labelIcon: {
    fontSize: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1a237e',
    letterSpacing: 0.8,
  },
  inputWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 3,
    borderColor: '#e0e4e8',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: '#1a237e',
    fontWeight: '600',
  },
  inputFocused: {
    borderColor: '#ff9800',
    backgroundColor: '#ffffff',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  inputOrangeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#ff9800',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    pointerEvents: 'none',
  },
  loginButton: {
    borderRadius: 16,
    marginTop: 16,
    overflow: 'visible',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#ff6f00',
  },
  loginButtonGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff9800',
    flexDirection: 'row',
    gap: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    top: 0,
    left: 0,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonArrow: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '900',
  } as any,
  forgotPassword: {
    marginTop: 32,
    alignItems: 'center',
    position: 'relative',
  },
  forgotPasswordText: {
    color: '#ff9800',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  forgotPasswordUnderline: {
    position: 'absolute',
    bottom: -4,
    width: 140,
    height: 2,
    backgroundColor: '#ff9800',
    borderRadius: 1,
  },
});








