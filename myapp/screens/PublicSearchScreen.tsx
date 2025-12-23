import React, { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logoImageModule from '../assets/images/logo.png';


interface PublicSearchScreenProps {
  onLogin: () => void;
  isLoggedIn?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const isMobile = screenWidth < 768;

interface Consultation {
  cle_dce: string;
  etat: number;
  identifiant: string;
  ref_interne: string;
  objet: string;
  denomination_pa: string;
  type_marche: string;
  type_marche_label: string;
  type_prestation: string;
  date_publication_f: string;
  date_cloture_f: string;
  departements_prestation: string;
  passation_label: string;
}

export default function PublicSearchScreen({ onLogin, isLoggedIn = false }: PublicSearchScreenProps) {
  const [fournitures, setFournitures] = useState(false);
  const [services, setServices] = useState(false);
  const [travaux, setTravaux] = useState(false);
  const [keywordSearch, setKeywordSearch] = useState('');
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [language, setLanguage] = useState<'en' | 'fr'>('fr');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [logoImage, setLogoImage] = useState<number | null>(null);
  
  // Charger l'image avec expo-asset
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const asset = Asset.fromModule(logoImageModule);
        await asset.downloadAsync();
        setLogoImage(logoImageModule);
      } catch (error) {
        console.error('Erreur lors du chargement du logo:', error);
      }
    };
    loadLogo();
  }, []);

  // Obtenir la hauteur de la barre de statut
  const statusBarHeight = Platform.OS === 'android' 
    ? (StatusBar.currentHeight || 0) 
    : Platform.OS === 'ios' 
      ? 44
      : 0;

  // Mise à jour de l'heure
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}.${minutes}.${seconds}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Charger les consultations et les favoris
  useEffect(() => {
    // Initialiser avec une liste vide - les consultations seront chargées depuis l'API si nécessaire
    setConsultations([]);
    loadFavorites();
  }, []);

  // Charger les favoris depuis AsyncStorage
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        const favoritesArray = JSON.parse(storedFavorites);
        setFavorites(new Set(favoritesArray));
      }
    } catch (error) {
      // Error loading favorites
    }
  };

  // Afficher les consultations favorites
  const handleShowFavorites = () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Connexion requise',
        'Vous devez vous connecter pour accéder à vos favoris.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: onLogin }
        ]
      );
      return;
    }
    
    if (favorites.size === 0) {
      Alert.alert('Aucun favori', 'Vous n\'avez pas encore de consultations favorites.');
      return;
    }
    setShowFavorites(true);
  };

  // Filtrer les consultations favorites
  const favoriteConsultations = consultations.filter((consultation) => {
    const consultationId = consultation.cle_dce || consultation.identifiant || '';
    return favorites.has(consultationId);
  });

  const getCurrentDate = () => {
    const now = new Date();
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    return `${now.getDate()} ${months[now.getMonth()]}`;
  };

  const [selectedNavItem, setSelectedNavItem] = useState('search');

  const navItems = [
    { id: 'search', fr: 'RECHERCHE DE\nCONSULTATIONS', en: 'SEARCH FOR\nTENDERS', isOrange: true },
    { id: 'data', fr: 'DONNÉES ESSENTIELLES', en: 'CONTRACT\nDATA', isOrange: false },
    { id: 'awards', fr: 'AVIS D\'ATTRIBUTION', en: 'CONTRACT\nAWARDS', isOrange: false },
    { id: 'history', fr: 'HISTORIQUE', en: 'HISTORY', isOrange: false },
    { id: 'cert', fr: 'CERTIFICAT DE SIGNATURE\nÉLECTRONIQUE', en: 'ELECTRONIC\nSIGNATURE\nCERTIFICATE', isOrange: false },
    { id: 'faq', fr: 'FAQ', en: 'FAQ', isOrange: false },
    { id: 'links', fr: 'LIENS UTILES', en: 'USEFUL LINKS', isOrange: false, disabled: false },
    { id: 'about', fr: 'QUI SOMMES NOUS?', en: 'WHO WE ARE?', isOrange: false },
    { id: 'partners', fr: 'PARTENAIRES\nRÉFÉRENCES', en: 'REFERENCE\nPARTNERS', isOrange: false },
    { id: 'buyer', fr: 'ESPACE ACHETEUR', en: 'BUYER AREA', isOrange: false },
  ];

  return (
    <View style={styles.container}>
      {/* StatusBar translucide */}
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="dark-content" 
      />
      
      {/* Navbar scrollable en haut */}
      <View style={styles.topNavbar}>
        <View style={[styles.topMenuWrapper, { paddingTop: statusBarHeight }]}>
          <View style={styles.topMenuGradient} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.topMenuScroll}
            contentContainerStyle={styles.topMenuContent}
            bounces={true}
            scrollEnabled={true}
          >
            {/* Logo */}
            <View style={styles.topMenuItem}>
              <View style={styles.logoContainer}>
                {logoImage && (
                  <Image 
                    source={logoImage} 
                    style={styles.navbarLogo}
                    resizeMode="contain"
                  />
                )}
              </View>
            </View>

            {/* Date et Heure */}
            <View style={styles.topMenuItem}>
              <View style={styles.timeDateContainer}>
                <Text style={styles.currentTime}>{currentTime}</Text>
                <Text style={styles.currentDate}>{getCurrentDate()}</Text>
              </View>
            </View>

            {/* Séparateur */}
            <View style={styles.menuSeparator} />

            {/* MS 2.0 */}
            <View style={styles.topMenuItem}>
              <View style={styles.msBadge}>
                <Text style={styles.msBadgeText}>MS 2.0</Text>
              </View>
            </View>

            {/* Séparateur */}
            <View style={styles.menuSeparator} />

            {/* Bouton Langue */}
            <View style={styles.topMenuItem}>
              <TouchableOpacity 
                style={styles.langButtonInMenu}
                onPress={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                activeOpacity={0.8}
              >
                <Text style={styles.langButtonInMenuText}>{language === 'en' ? 'EN' : 'FR'}</Text>
              </TouchableOpacity>
            </View>

            {/* Séparateur */}
            <View style={styles.menuSeparator} />

            {/* Hotline */}
            <View style={styles.topMenuItem}>
              <View style={styles.hotlineCompact}>
                <Text style={styles.hotlineIcon}>📞</Text>
                <Text style={styles.hotlineTextCompact}>HOTLINE +33 (0)4 92 90 93 27</Text>
              </View>
            </View>

            {/* Séparateur */}
            <View style={styles.menuSeparator} />

            {/* Bouton CONTACT US */}
            <View style={styles.topMenuItem}>
              <TouchableOpacity 
                style={styles.contactUsButton}
                onPress={() => {
                  Alert.alert('NOUS CONTACTER', 'Contactez-nous via le formulaire de contact');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.contactUsIcon}>💬</Text>
                <Text style={styles.contactUsText}>NOUS CONTACTER</Text>
              </TouchableOpacity>
            </View>

            {/* Séparateur */}
            <View style={styles.menuSeparator} />

            {/* Bouton ACCESS THE TRAINING SCHEDULE */}
            <View style={styles.topMenuItem}>
              <TouchableOpacity 
                style={styles.trainingButton}
                onPress={() => {
                  Alert.alert('ACCÉDER AU CALENDRIER DE FORMATION', 'Accédez au calendrier de formation');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.trainingIcon}>🎓</Text>
                <View style={styles.trainingButtonTextContainer}>
                  <Text style={styles.trainingButtonText}>ACCÉDER AU CALENDRIER DE FORMATION</Text>
                  <Text style={styles.trainingButtonSubtext}>CLIQUEZ ICI</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Séparateur */}
            <View style={styles.menuSeparator} />

            {/* Bouton LOG IN / CREATE ACCOUNT */}
            <View style={styles.topMenuItem}>
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={onLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonIcon}>👤</Text>
                <Text style={styles.loginButtonText}>LOG IN / CREATE ACCOUNT</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoSection}>
            {logoImage && (
              <Image 
                source={logoImage} 
                style={styles.logo}
                resizeMode="contain"
              />
            )}
            <View style={styles.titleSection}>
              <View style={styles.mainTitle}>
                <Text style={styles.titleBlue}>MARCHÉS </Text>
                <Text style={styles.titleOrange}>SÉCURISÉS</Text>
              </View>
            </View>
          </View>
          {/* Bouton Login fixe en haut à droite */}
          <TouchableOpacity 
            style={styles.fixedLoginButton}
            onPress={onLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.fixedLoginIcon}>👤</Text>
            <Text style={styles.fixedLoginText}>LOG IN</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Bar */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.navBar}
          contentContainerStyle={styles.navBarContent}
        >
          {navItems.map((item, index) => {
            const isActive = selectedNavItem === item.id;
            const isDisabled = item.disabled || false;
            const displayText = language === 'fr' ? item.fr : item.en;
            
            return (
              <React.Fragment key={item.id}>
                {index > 0 && <View style={styles.navSeparator} />}
                <TouchableOpacity 
                  style={[
                    styles.navItem,
                    isActive && styles.navItemActive,
                    isDisabled && styles.navItemDisabled
                  ]}
                  onPress={() => !isDisabled && setSelectedNavItem(item.id)}
                  disabled={isDisabled}
                  activeOpacity={0.7}
                >
                  {displayText.includes('\n') ? (
                    <View style={styles.navTextContainer}>
                      {displayText.split('\n').map((line, idx) => (
                        <Text 
                          key={idx}
                          style={[
                            styles.navText,
                            item.isOrange && styles.navTextOrange,
                            !item.isOrange && styles.navTextBlue,
                            isActive && styles.navTextActive
                          ]}
                        >
                          {line}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text style={[
                      styles.navText,
                      item.isOrange && styles.navTextOrange,
                      !item.isOrange && styles.navTextBlue,
                      isActive && styles.navTextActive
                    ]}>
                      {displayText}
                    </Text>
                  )}
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.consultationsTitle}>
              Consultations <Text style={styles.availableCount}>(1175 disponibles)</Text>
            </Text>
            <TouchableOpacity 
              style={styles.bookmarksButton}
              onPress={handleShowFavorites}
              activeOpacity={0.7}
            >
              <Text style={styles.bookmarksIcon}>⭐</Text>
              <Text style={styles.bookmarksText}>My Bookmarks</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.orangeBar} />
        </View>

        {/* Search Box */}
        <View style={styles.searchBox}>
          {/* Filter Checkboxes */}
          <View style={styles.filtersContainer}>
            <TouchableOpacity 
              style={styles.filterItem}
              onPress={() => setFournitures(!fournitures)}
            >
              <View style={[styles.checkbox, fournitures && styles.checkboxChecked]}>
                {fournitures && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.filterLabel}>Fournitures</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.filterItem}
              onPress={() => setServices(!services)}
            >
              <View style={[styles.checkbox, services && styles.checkboxChecked]}>
                {services && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.filterLabel}>Services</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.filterItem}
              onPress={() => setTravaux(!travaux)}
            >
              <View style={[styles.checkbox, travaux && styles.checkboxChecked]}>
                {travaux && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.filterLabel}>Travaux</Text>
            </TouchableOpacity>
          </View>

          {/* Keyword Search */}
          <View style={styles.searchInputContainer}>
            <View style={styles.searchIconContainer}>
              <Text style={styles.searchIcon}>🎯</Text>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Ex: électricité, assurance, CCAS, Lille"
              placeholderTextColor="#999"
              value={keywordSearch}
              onChangeText={setKeywordSearch}
            />
          </View>

          {/* Department Search */}
          <View style={styles.searchInputContainer}>
            <View style={styles.searchIconContainer}>
              <Text style={styles.searchIcon}>📍</Text>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Département (94, 94000)"
              placeholderTextColor="#999"
              value={departmentSearch}
              onChangeText={setDepartmentSearch}
            />
          </View>

          {/* Search Button */}
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => {
              // Fonction de recherche à implémenter
              Alert.alert('Recherche', 'Fonctionnalité de recherche en cours de développement');
            }}
          >
            <Text style={styles.searchButtonIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Affichage des favoris */}
        {showFavorites && (
          <View style={styles.favoritesContainer}>
            {/* En-tête */}
            <View style={styles.favoritesHeader}>
              <View style={styles.favoritesTitleRow}>
                <Text style={styles.favoritesTitle}>⭐ Consultations Favorites</Text>
                <View style={styles.favoritesBadge}>
                  <Text style={styles.favoritesBadgeText}>{favoriteConsultations.length}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowFavorites(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Liste des favoris */}
            {favoriteConsultations.length === 0 ? (
              <View style={styles.noFavorites}>
                <Text style={styles.noFavoritesIcon}>⭐</Text>
                <Text style={styles.noFavoritesText}>Aucune consultation favorite</Text>
                <Text style={styles.noFavoritesSubtext}>Ajoutez des consultations en favoris pour les retrouver facilement</Text>
              </View>
            ) : (
              <ScrollView style={styles.favoritesList} showsVerticalScrollIndicator={false}>
                {favoriteConsultations.map((consultation) => (
                  <View key={consultation.cle_dce || consultation.identifiant} style={styles.favoriteCard}>
                    {/* Bordure gauche */}
                    <View style={styles.cardLeftBorder} />
                    
                    {/* Contenu */}
                    <View style={styles.cardContent}>
                      {/* Ligne 1: Référence */}
                      <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Référence:</Text>
                        <Text style={styles.cardRefValue}>{consultation.identifiant}</Text>
                      </View>

                      {/* Ligne 2: Pouvoir Adjudicateur */}
                      <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Pouvoir Adjudicateur:</Text>
                        <Text style={styles.cardValue}>{consultation.denomination_pa}</Text>
                      </View>

                      {/* Ligne 3: Type */}
                      <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Type:</Text>
                        <Text style={styles.cardValue}>
                          {consultation.type_prestation} - {consultation.type_marche_label}
                        </Text>
                      </View>

                      {/* Ligne 4: Département */}
                      <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Département:</Text>
                        <Text style={styles.cardValue}>{consultation.departements_prestation}</Text>
                      </View>

                      {/* Ligne 5: Date limite avec badge */}
                      <View style={styles.cardFooter}>
                        <View style={styles.cardDateContainer}>
                          <Text style={styles.cardDateLabel}>Date limite:</Text>
                          <Text style={styles.cardDateValue}>{consultation.date_cloture_f}</Text>
                        </View>
                        <View style={styles.cardStatusBadge}>
                          <Text style={styles.cardStatusText}>
                            {consultation.passation_label || 'EN COURS'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerOrangeBar} />
        <View style={styles.footerContent}>
          <Text style={styles.footerQuestion}>BESOIN D'AIDE DANS VOS DÉMARCHES?</Text>
          <View style={styles.hotlineSection}>
            <Text style={styles.hotlineTitle}>HOTLINE</Text>
            <Text style={styles.hotlineIcon}>📞</Text>
            <Text style={styles.hotlineNumber}>04 92 90 93 27</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // Navbar scrollable en haut
  topNavbar: {
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  topMenuWrapper: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    borderRadius: 0,
    overflow: 'visible',
    position: 'relative',
    backgroundColor: '#d4dce8',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  topMenuGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e8ecf2',
    borderRadius: 0,
    opacity: 0.8,
  },
  topMenuScroll: {
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingVertical: 4,
    position: 'relative',
    zIndex: 1,
    width: '100%',
  },
  topMenuContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    minWidth: '100%',
  },
  topMenuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    flexShrink: 0,
  },
  menuSeparator: {
    width: 1,
    height: 24,
    backgroundColor: '#999999',
    marginHorizontal: 10,
    opacity: 0.4,
    alignSelf: 'center',
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  navbarLogo: {
    width: 24,
    height: 24,
  },
  timeDateContainer: {
    flexDirection: 'column',
    gap: 2,
    justifyContent: 'center',
  },
  currentTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#262626',
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  currentDate: {
    fontSize: 10,
    fontWeight: '400',
    color: '#8e8e8e',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
    lineHeight: 12,
  },
  msBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  msBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  langButtonInMenu: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  langButtonInMenuText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#262626',
    letterSpacing: 0.2,
  },
  hotlineCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  hotlineIcon: {
    fontSize: 14,
    color: '#262626',
  },
  hotlineTextCompact: {
    fontSize: 11,
    fontWeight: '600',
    color: '#262626',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  contactUsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactUsIcon: {
    fontSize: 14,
  },
  contactUsText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#262626',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  trainingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1976D2',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  trainingIcon: {
    fontSize: 16,
  },
  trainingButtonTextContainer: {
    flexDirection: 'column',
    gap: 2,
  },
  trainingButtonText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    lineHeight: 11,
  },
  trainingButtonSubtext: {
    fontSize: 8,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loginButtonIcon: {
    fontSize: 14,
  },
  loginButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#262626',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  fixedLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'transparent',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1a237e',
  },
  fixedLoginIcon: {
    fontSize: 14,
    color: '#1a237e',
  },
  fixedLoginText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1a237e',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  logo: {
    width: 50,
    height: 50,
  },
  titleSection: {
    flex: 1,
  },
  mainTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleBlue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a237e',
    letterSpacing: 0.2,
  },
  titleOrange: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff9800',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff9800',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  navBar: {
    maxHeight: 60,
  },
  navBarContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: 'transparent',
  },
  navItemDisabled: {
    opacity: 0.5,
  },
  navTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
    lineHeight: 14,
  },
  navTextOrange: {
    color: '#ff9800',
  },
  navTextBlue: {
    color: '#1a237e',
  },
  navTextDisabled: {
    color: '#999999',
  },
  navTextActive: {
    fontWeight: '900',
  },
  navSeparator: {
    width: 1,
    height: 30,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  titleContainer: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  consultationsTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a237e',
    flex: 1,
  },
  bookmarksButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
  },
  bookmarksIcon: {
    fontSize: 18,
  },
  bookmarksText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a237e',
  },
  availableCount: {
    fontSize: 18,
    fontWeight: '400',
    color: '#666',
  },
  orangeBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#ff9800',
    borderRadius: 2,
  },
  searchBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 20,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 25,
    flexWrap: 'wrap',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#1a237e',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1a237e',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a237e',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  searchIconContainer: {
    marginRight: 10,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#1a237e',
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  searchButtonIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 20,
  },
  footerOrangeBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#ff9800',
    marginBottom: 20,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexWrap: 'wrap',
    gap: 20,
  },
  footerQuestion: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a237e',
    flex: 1,
    minWidth: 200,
  },
  hotlineSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hotlineTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ff9800',
    letterSpacing: 1,
  },
  hotlineIconFooter: {
    fontSize: 24,
  },
  hotlineNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
  },
  favoritesContainer: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  favoritesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#ff9800',
  },
  favoritesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoritesTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a237e',
    letterSpacing: 0.5,
  },
  favoritesBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 30,
    alignItems: 'center',
  },
  favoritesBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  favoritesList: {
    maxHeight: 500,
  },
  favoriteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
  },
  cardLeftBorder: {
    width: 4,
    backgroundColor: '#ff9800',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    width: 140,
    flexShrink: 0,
  },
  cardRefValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a237e',
    flex: 1,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardDateContainer: {
    flex: 1,
  },
  cardDateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  cardDateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff9800',
  },
  cardStatusBadge: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ffcc80',
  },
  cardStatusText: {
    color: '#ff9800',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  noFavorites: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
  },
  noFavoritesIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noFavoritesText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  noFavoritesSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});





