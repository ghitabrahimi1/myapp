import React, { useState, useEffect, useRef } from 'react';
import { Asset } from 'expo-asset';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  Animated,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logoImage from '../assets/images/logo.png';
import { getConsultationsList } from './LoginScreen';


interface HomeScreenProps {
  username: string;
  onLogout: () => void;
}

interface Consultation {
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
  passation_id: number;
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

const translations = {
  fr: {
    nav: {
      projets: 'PROJETS',
      joueBoampJal: 'JOUE BOAMP JAL',
      consultations: 'CONSULTATIONS',
      ressources: 'RESSOURCES',
      documentation: 'DOCUMENTATION',
      bdc: 'BDC',
      agendaFormations: 'AGENDA DE FORMATIONS',
      administration: 'ADMINISTRATION',
      espaceEntreprise: 'ESPACE ENTREPRISE',
    },
    sidebar: {
      nouvelles: 'CONSULTATIONS NOUVELLES',
      valider: 'CONSULTATIONS À VALIDER',
      enCours: 'CONSULTATIONS EN COURS',
      cloturees: 'CONSULTATIONS CLÔTURÉES',
    },
    search: 'Rechercher des consultations',
    results: 'résultats',
    searchPlaceholder: 'Tapez votre recherche ici',
    consultations: 'Consultations',
    olivi: 'SEM',
    createConsultation: 'Créer la consultation',
    itemsPerPage: 'Éléments par page :',
    reference: 'Référence',
    shopper: 'Acheteur',
    geoService: 'Géographie du service',
    tenderDate: 'Date d\'appel d\'offres',
    deadline: 'Date limite',
    casablancaTime: '(heure de Casablanca)',
    waiting: 'waiting',
    noResults: 'Aucune consultation trouvée',
    hotline: 'HOTLINE',
    contactUs: 'NOUS CONTACTER',
    accessTrainingSchedule: 'ACCÉDER AU CALENDRIER DE FORMATION',
    clickHere: 'CLIQUEZ ICI',
    adjudicatingAuthority: 'Pouvoir Adjudicateur',
    menu: 'Menu',
    at: 'à',
    hours: 'h',
    minutes: 'mn',
    modal: {
      title: 'En cours de création',
      reference: 'RÉFÉRENCE',
      procedure: 'PROCÉDURE',
      typePrestation: 'TYPE DE PRESTATION',
      dateCreation: 'DATE DE CRÉATION',
      refInterne: 'RÉFÉRENCE INTERNE',
      objet: 'OBJET DE LA CONSULTATION',
      rattacherGroupe: 'RATTACHER CETTE CONSULTATION À UN GROUPE',
      consultationLancee: 'CONSULTATION LANCÉE EN VUE DE CONCLURE',
      typeConsultation: 'TYPE DE CONSULTATION',
      typeAcheteur: 'TYPE DE L\'ACHETEUR',
      datePublication: 'Date de publication',
      dateCloture: 'Date de clôture',
      miseEnLigne: 'MISE EN LIGNE DE LA CONSULTATION',
      zonesGeo: 'ZONE(S) GÉO. DE LA PRESTATION',
      emails: 'E-MAILS DES DESTINATAIRES DES NOTIFICATIONS DU SERVEUR',
      piecesCommunes: 'PIÈCES COMMUNES',
      aucunePiece: 'Aucune pièce définie pour cette rubrique',
      selectionnerZones: 'Sélectionner les zones géographiques',
      valider: 'Valider',
      annuler: 'Annuler',
      enregistrer: 'Enregistrer',
      aucuneProcedure: 'Aucune procédure sélectionnée',
      aucunePrestation: 'Aucune prestation sélectionnée',
    },
  },
  en: {
    nav: {
      projets: 'PROJECTS',
      joueBoampJal: 'JOUE BOAMP JAL',
      consultations: 'CONSULTATIONS',
      ressources: 'RESOURCES',
      documentation: 'DOCUMENTATION',
      bdc: 'BDC',
      agendaFormations: 'TRAINING SCHEDULE',
      administration: 'ADMINISTRATION',
      espaceEntreprise: 'BUSINESS SPACE',
    },
    sidebar: {
      nouvelles: 'NEW CONSULTATIONS',
      valider: 'CONSULTATIONS TO VALIDATE',
      enCours: 'ONGOING CONSULTATIONS',
      cloturees: 'CLOSED CONSULTATIONS',
    },
    search: 'Search for consultations',
    results: 'results',
    searchPlaceholder: 'Type your search here',
    consultations: 'Consultations',
    olivi: 'SEM',
    createConsultation: 'Create the consultation',
    itemsPerPage: 'Items per page:',
    reference: 'Reference',
    shopper: 'Shopper',
    geoService: 'Geo. of the service',
    tenderDate: 'Tender date',
    deadline: 'Deadline',
    casablancaTime: '(Casablanca time)',
    waiting: 'waiting',
    noResults: 'No consultation found',
    hotline: 'HOTLINE',
    contactUs: 'CONTACT US',
    accessTrainingSchedule: 'ACCESS THE TRAINING SCHEDULE',
    clickHere: 'CLICK HERE',
    adjudicatingAuthority: 'Adjudicating Authority',
    menu: 'Menu',
    at: 'at',
    hours: 'h',
    minutes: 'mn',
    modal: {
      title: 'In creation',
      reference: 'REFERENCE',
      procedure: 'PROCEDURE',
      typePrestation: 'TYPE OF SERVICE',
      dateCreation: 'CREATION DATE',
      refInterne: 'INTERNAL REFERENCE',
      objet: 'OBJECT OF THE CONSULTATION',
      rattacherGroupe: 'ATTACH THIS CONSULTATION TO A GROUP',
      consultationLancee: 'CONSULTATION LAUNCHED WITH A VIEW TO CONCLUDE',
      typeConsultation: 'TYPE OF CONSULTATION',
      typeAcheteur: 'TYPE OF BUYER',
      datePublication: 'Publication date',
      dateCloture: 'Closing date',
      miseEnLigne: 'ONLINE PUBLICATION OF THE CONSULTATION',
      zonesGeo: 'GEOGRAPHICAL ZONE(S) OF THE SERVICE',
      emails: 'RECIPIENT EMAILS FOR SERVER NOTIFICATIONS',
      piecesCommunes: 'COMMON PARTS',
      aucunePiece: 'No item defined for this section',
      selectionnerZones: 'Select geographical zones',
      valider: 'Validate',
      annuler: 'Cancel',
      enregistrer: 'Save',
      aucuneProcedure: 'No procedure selected',
      aucunePrestation: 'No service selected',
    },
  },
  de: {
    nav: {
      projets: 'PROJEKTE',
      joueBoampJal: 'JOUE BOAMP JAL',
      consultations: 'KONSULTATIONEN',
      ressources: 'RESSOURCEN',
      documentation: 'DOKUMENTATION',
      bdc: 'BDC',
      agendaFormations: 'AUSBILDUNGSKALENDER',
      administration: 'VERWALTUNG',
      espaceEntreprise: 'UNTERNEHMENSBEREICH',
    },
    sidebar: {
      nouvelles: 'NEUE KONSULTATIONEN',
      valider: 'ZU VALIDIERENDE KONSULTATIONEN',
      enCours: 'LAUFENDE KONSULTATIONEN',
      cloturees: 'ABGESCHLOSSENE KONSULTATIONEN',
    },
    search: 'Konsultationen suchen',
    results: 'Ergebnisse',
    searchPlaceholder: 'Geben Sie Ihre Suche hier ein',
    consultations: 'Konsultationen',
    olivi: 'SEM',
    createConsultation: 'Konsultation erstellen',
    itemsPerPage: 'Elemente pro Seite:',
    reference: 'Referenz',
    shopper: 'Käufer',
    geoService: 'Geografie des Dienstes',
    tenderDate: 'Ausschreibungsdatum',
    deadline: 'Frist',
    casablancaTime: '(Casablanca-Zeit)',
    waiting: 'Warten',
    noResults: 'Keine Konsultation gefunden',
    hotline: 'HOTLINE',
    contactUs: 'KONTAKTIEREN SIE UNS',
    accessTrainingSchedule: 'ZUGANG ZUM AUSBILDUNGSKALENDER',
    clickHere: 'KLICKEN SIE HIER',
    adjudicatingAuthority: 'Vergabestelle',
    menu: 'Menü',
    at: 'um',
    hours: 'h',
    minutes: 'Min',
    modal: {
      title: 'In Bearbeitung',
      reference: 'REFERENZ',
      procedure: 'VERFAHREN',
      typePrestation: 'LEISTUNGSART',
      dateCreation: 'ERSTELLUNGSDATUM',
      refInterne: 'INTERNE REFERENZ',
      objet: 'GEGENSTAND DER KONSULTATION',
      rattacherGroupe: 'DIESE KONSULTATION EINER GRUPPE ZUORDNEN',
      consultationLancee: 'KONSULTATION ZUR ABSCHLUSSVORBEREITUNG',
      typeConsultation: 'ART DER KONSULTATION',
      typeAcheteur: 'ART DES KÄUFERS',
      datePublication: 'Veröffentlichungsdatum',
      dateCloture: 'Schließungsdatum',
      miseEnLigne: 'ONLINE-VERÖFFENTLICHUNG DER KONSULTATION',
      zonesGeo: 'GEOGRAFISCHE ZONE(N) DER LEISTUNG',
      emails: 'E-MAILS DER EMPFÄNGER DER SERVERBENACHRICHTIGUNGEN',
      piecesCommunes: 'GEMEINSAME TEILE',
      aucunePiece: 'Kein Teil für diesen Abschnitt definiert',
      selectionnerZones: 'Geografische Zonen auswählen',
      valider: 'Bestätigen',
      annuler: 'Abbrechen',
      enregistrer: 'Speichern',
      aucuneProcedure: 'Kein Verfahren ausgewählt',
      aucunePrestation: 'Keine Leistung ausgewählt',
    },
  },
};

// Liste des départements français
const DEPARTEMENTS = [
  '01 - Ain', '02 - Aisne', '03 - Allier', '04 - Alpes-de-Haute-Provence', '05 - Hautes-Alpes',
  '06 - Alpes-Maritimes', '07 - Ardèche', '08 - Ardennes', '09 - Ariège', '10 - Aube',
  '11 - Aude', '12 - Aveyron', '13 - Bouches-du-Rhône', '14 - Calvados', '15 - Cantal',
  '16 - Charente', '17 - Charente-Maritime', '18 - Cher', '19 - Corrèze', '21 - Côte-d\'Or',
  '22 - Côtes-d\'Armor', '23 - Creuse', '24 - Dordogne', '25 - Doubs', '26 - Drôme',
  '27 - Eure', '28 - Eure-et-Loir', '29 - Finistère', '2A - Corse-du-Sud', '2B - Haute-Corse',
  '30 - Gard', '31 - Haute-Garonne', '32 - Gers', '33 - Gironde', '34 - Hérault',
  '35 - Ille-et-Vilaine', '36 - Indre', '37 - Indre-et-Loire', '38 - Isère', '39 - Jura',
  '40 - Landes', '41 - Loir-et-Cher', '42 - Loire', '43 - Haute-Loire', '44 - Loire-Atlantique',
  '45 - Loiret', '46 - Lot', '47 - Lot-et-Garonne', '48 - Lozère', '49 - Maine-et-Loire',
  '50 - Manche', '51 - Marne', '52 - Haute-Marne', '53 - Mayenne', '54 - Meurthe-et-Moselle',
  '55 - Meuse', '56 - Morbihan', '57 - Moselle', '58 - Nièvre', '59 - Nord',
  '60 - Oise', '61 - Orne', '62 - Pas-de-Calais', '63 - Puy-de-Dôme', '64 - Pyrénées-Atlantiques',
  '65 - Hautes-Pyrénées', '66 - Pyrénées-Orientales', '67 - Bas-Rhin', '68 - Haut-Rhin', '69 - Rhône',
  '70 - Haute-Saône', '71 - Saône-et-Loire', '72 - Sarthe', '73 - Savoie', '74 - Haute-Savoie',
  '75 - Paris', '76 - Seine-Maritime', '77 - Seine-et-Marne', '78 - Yvelines', '79 - Deux-Sèvres',
  '80 - Somme', '81 - Tarn', '82 - Tarn-et-Garonne', '83 - Var', '84 - Vaucluse',
  '85 - Vendée', '86 - Vienne', '87 - Haute-Vienne', '88 - Vosges', '89 - Yonne',
  '90 - Territoire de Belfort', '91 - Essonne', '92 - Hauts-de-Seine', '93 - Seine-Saint-Denis',
  '94 - Val-de-Marne', '95 - Val-d\'Oise', '971 - Guadeloupe', '972 - Martinique', '973 - Guyane',
  '974 - La Réunion', '976 - Mayotte'
];

export default function HomeScreen({ username, onLogout }: HomeScreenProps) {
  const [selectedNav, setSelectedNav] = useState('CONSULTATIONS');
  const [selectedSidebar, setSelectedSidebar] = useState('CONSULTATIONS NOUVELLES');
  const [searchQuery, setSearchQuery] = useState('');
  const [consultationType, setConsultationType] = useState({ consultations: true, sem: false });
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [language, setLanguage] = useState<'en' | 'fr' | 'de'>('fr');
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [logoImageSource, setLogoImageSource] = useState<number | null>(null);
  
  // États pour le formulaire d'édition
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
  const [editFormData, setEditFormData] = useState({
    ref_interne: '',
    objet: '',
    consultation_lancee: 'Marché(s)',
    type_consultation: 'Publique (CT et organismes assimilés)',
    type_acheteur: 'Pouvoir Adjudicateur',
    procedure: '',
    type_prestation: '',
    date_publication: '',
    date_cloture: '',
    mise_en_ligne: 'OUI',
    zones_geo: [] as string[],
    emails: [] as string[],
  });
  const [editErrors, setEditErrors] = useState<string[]>([]);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [commonPartsFiles, setCommonPartsFiles] = useState<Array<{ name: string; size: number; uri?: string }>>([]);
  
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
  
  const t = translations[language];
  
  // Animations pour le background réactif orange et bleu
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;
  const animatedValue3 = useRef(new Animated.Value(0)).current;
  const animatedValue4 = useRef(new Animated.Value(0)).current;
  
  // Obtenir la hauteur de la barre de statut
  const statusBarHeight = Platform.OS === 'android' 
    ? (StatusBar.currentHeight || 0) 
    : Platform.OS === 'ios' 
      ? 44  // Hauteur typique de la barre de statut iOS
      : 0;
  
  const navItemsMap = [
    { id: 'projets', fr: 'PROJETS', en: 'PROJECTS', de: 'PROJEKTE' },
    { id: 'joue-boamp-jal', fr: 'JOUE BOAMP JAL', en: 'JOUE BOAMP JAL', de: 'JOUE BOAMP JAL' },
    { id: 'consultations', fr: 'CONSULTATIONS', en: 'CONSULTATIONS', de: 'KONSULTATIONEN' },
    { id: 'ressources', fr: 'RESSOURCES', en: 'RESOURCES', de: 'RESSOURCEN' },
    { id: 'documentation', fr: 'DOCUMENTATION', en: 'DOCUMENTATION', de: 'DOKUMENTATION' },
    { id: 'bdc', fr: 'BDC', en: 'BDC', de: 'BDC' },
    { id: 'agenda-formations', fr: 'AGENDA DE FORMATIONS', en: 'TRAINING SCHEDULE', de: 'AUSBILDUNGSKALENDER' },
    { id: 'administration', fr: 'ADMINISTRATION', en: 'ADMINISTRATION', de: 'VERWALTUNG' },
    { id: 'espace-entreprise', fr: 'ESPACE ENTREPRISE', en: 'BUSINESS SPACE', de: 'UNTERNEHMENSBEREICH' },
  ];
  
  const sidebarItemsMap = [
    { id: 'nouvelles', fr: 'CONSULTATIONS NOUVELLES', en: 'NEW CONSULTATIONS', de: 'NEUE KONSULTATIONEN' },
    { id: 'valider', fr: 'CONSULTATIONS À VALIDER', en: 'CONSULTATIONS TO VALIDATE', de: 'ZU VALIDIERENDE KONSULTATIONEN' },
    { id: 'en-cours', fr: 'CONSULTATIONS EN COURS', en: 'ONGOING CONSULTATIONS', de: 'LAUFENDE KONSULTATIONEN' },
    { id: 'cloturees', fr: 'CONSULTATIONS CLÔTURÉES', en: 'CLOSED CONSULTATIONS', de: 'ABGESCHLOSSENE KONSULTATIONEN' },
    { id: 'favoris', fr: '⭐ FAVORIS', en: '⭐ FAVORITES', de: '⭐ FAVORITEN' },
  ];
  
  const navItems = navItemsMap.map(item => item[language]);
  const sidebarItems = sidebarItemsMap.map(item => item[language]);
  
  // Synchroniser les sélections avec la langue
  useEffect(() => {
    const currentNavItem = navItemsMap.find(item => 
      item.fr === selectedNav || item.en === selectedNav || item.de === selectedNav
    );
    if (currentNavItem) {
      setSelectedNav(currentNavItem[language]);
    }
    
    const currentSidebarItem = sidebarItemsMap.find(item => 
      item.fr === selectedSidebar || item.en === selectedSidebar || item.de === selectedSidebar
    );
    if (currentSidebarItem) {
      setSelectedSidebar(currentSidebarItem[language]);
    }
  }, [language]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // Animations pour le background réactif gris-bleu - TRÈS RÉACTIF
  useEffect(() => {
    // Démarrer les animations immédiatement avec des valeurs initiales différentes pour plus de dynamisme
    animatedValue1.setValue(0);
    animatedValue2.setValue(0.3);
    animatedValue3.setValue(0.5);
    animatedValue4.setValue(0.2);

    // Animations TRÈS réactives - Plus rapides et plus dynamiques
    const animate1 = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue1, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue1, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );

    const animate2 = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue2, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue2, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );

    const animate3 = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue3, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue3, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );

    const animate4 = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue4, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue4, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );

    // Démarrer toutes les animations en parallèle IMMÉDIATEMENT
    Animated.parallel([
      animate1,
      animate2,
      animate3,
      animate4,
    ]).start();

    return () => {
      animate1.stop();
      animate2.stop();
      animate3.stop();
      animate4.stop();
      animatedValue1.stopAnimation();
      animatedValue2.stopAnimation();
      animatedValue3.stopAnimation();
      animatedValue4.stopAnimation();
    };
  }, []);

  const isMobile = screenWidth < 768;

  // Fonction pour charger les consultations depuis l'API
  const loadConsultationsFromAPI = async (
    cle_etab: string = "1335931861y69q6ubkj944",
    typeConsultation: 'nouvelles' | 'valider' | 'enCours' | 'cloturees' = 'nouvelles'
  ) => {
    try {
      setLoadingConsultations(true);
      // Réinitialiser les consultations pour éviter d'afficher des données obsolètes
      setConsultations([]);
      console.log('=== DÉBUT loadConsultationsFromAPI ===');
      console.log('Type de consultation:', typeConsultation);
      const token = await AsyncStorage.getItem('access_token');
      console.log('Token récupéré:', token ? token.substring(0, 20) + '...' : 'NULL');
      
      if (!token) {
        console.error('ERREUR: Token non trouvé!');
        Alert.alert('Erreur', 'Token d\'authentification non trouvé. Veuillez vous reconnecter.');
        setLoadingConsultations(false);
        return;
      }
      
      // Vérifier si le token est un vrai token OAuth2 (ne commence pas par "token_")
      if (token.startsWith('token_')) {
        console.error('ERREUR: Token invalide (token de fallback détecté)!');
        Alert.alert('Erreur', 'Token d\'authentification invalide. Veuillez vous reconnecter.');
        setLoadingConsultations(false);
        return;
      }
      
      // Déterminer les paramètres selon le type de consultation
      let etatValue: string;
      let ordreValue: string;
      
      switch (typeConsultation) {
        case 'nouvelles':
          // Consultations nouvelles : état 0 uniquement (nouvelles/non traitées)
          etatValue = "0";
          ordreValue = "date_creation";
          break;
        case 'valider':
          // Consultations à valider : état spécifique
          etatValue = "0";
          ordreValue = "date_creation";
          break;
        case 'enCours':
          // Consultations en cours : état 0,1 (en cours)
          etatValue = "0,1";
          ordreValue = "date_cloture";
          break;
        case 'cloturees':
          // Consultations clôturées : état spécifique
          etatValue = "2";
          ordreValue = "date_cloture";
          break;
        default:
          etatValue = "0";
          ordreValue = "date_creation";
      }
      
      console.log(`Chargement des consultations ${typeConsultation} depuis l'API...`);
      console.log(`Paramètres: etat=${etatValue}, ordre=${ordreValue}`);
      
      // Pour les consultations nouvelles, utiliser l'endpoint unpublished_consultations_list
      const useUnpublished = typeConsultation === 'nouvelles';
      
      const result = await getConsultationsList(token, {
        cle_etab: cle_etab,
        etat: etatValue,
        sem: 0,
        useUnpublished: useUnpublished,
        pagination: {
          page: 1,
          nbr_par_page: 10,
          ordre: ordreValue,
          sens_ordre: "DESC"
        }
      });
      
      console.log('=== DONNÉES REÇUES DE L\'API ===');
      console.log('Nombre de consultations:', result.consultations.length);
      console.log('nb_total:', result.nb_total);
      console.log('pagination:', result.pagination);
      
      // Log détaillé de la première consultation pour vérifier les données
      if (result.consultations.length > 0) {
        const firstConsultation = result.consultations[0];
        console.log('=== PREMIÈRE CONSULTATION DE L\'API ===');
        console.log('cle_dce:', firstConsultation.cle_dce);
        console.log('identifiant:', firstConsultation.identifiant);
        console.log('objet:', firstConsultation.objet);
        console.log('ref_interne:', firstConsultation.ref_interne);
        console.log('date_creation:', firstConsultation.date_creation);
        console.log('date_creation_f:', firstConsultation.date_creation_f);
        console.log('denomination_pa:', firstConsultation.denomination_pa);
        console.log('=== FIN PREMIÈRE CONSULTATION ===');
      }
      
      // Ne pas filtrer ici car l'API retourne déjà les bonnes consultations selon les paramètres
      // L'API filtre déjà selon l'état avec le paramètre etat
      let filteredConsultations = result.consultations;
      
      console.log('Nombre de consultations reçues:', filteredConsultations.length);
      if (filteredConsultations.length > 0) {
        console.log('Structure de la première consultation:', Object.keys(filteredConsultations[0]));
        console.log('Valeurs de la première consultation:', {
          cle_dce: filteredConsultations[0].cle_dce,
          identifiant: filteredConsultations[0].identifiant,
          objet: filteredConsultations[0].objet,
          passation: filteredConsultations[0].passation,
        });
      }
      
      // Convertir les consultations de l'API vers le format local
      const convertedConsultations = filteredConsultations
        .filter((consultation) => {
          // Filtrer les consultations invalides
          if (!consultation || typeof consultation !== 'object') {
            console.warn('Consultation invalide ignorée:', consultation);
            return false;
          }
          // Vérifier que les champs essentiels sont présents
          if (!consultation.cle_dce || !consultation.identifiant) {
            console.warn('Consultation avec champs manquants ignorée:', consultation);
            return false;
          }
          return true;
        })
        .map((consultation, index) => {
          // Gérer passation_id : si passation est une chaîne vide ou non numérique, mettre 0
          let passation_id = 0;
          if (consultation.passation && typeof consultation.passation === 'string' && consultation.passation.trim() !== '') {
            // Essayer de parser comme nombre, sinon mettre 0
            const parsed = parseInt(consultation.passation);
            passation_id = isNaN(parsed) ? 0 : parsed;
          }
          
          // Préserver tous les champs du JSON avec le spread operator et ajouter des valeurs par défaut pour les champs manquants
          const converted = {
            ...consultation,
            passation_id: passation_id,
            // Valeurs par défaut pour les champs optionnels qui pourraient être manquants
            ref_interne: consultation.ref_interne || '',
            objet: consultation.objet || '',
            passation_label: consultation.passation_label || null,
            nb_lots: consultation.nb_lots || 0,
          } as Consultation;
          
          // Vérifier que tous les champs importants sont présents (seulement pour la première consultation)
          if (index === 0) {
            console.log('Exemple de consultation convertie avec tous les champs:', {
              cle_dce: converted.cle_dce,
              identifiant: converted.identifiant,
              objet: converted.objet,
              ref_interne: converted.ref_interne,
              denomination_pa: converted.denomination_pa,
              type_marche_label: converted.type_marche_label,
              type_prestation: converted.type_prestation,
              passation_label: converted.passation_label,
              nb_lots: converted.nb_lots,
              date_creation_f: converted.date_creation_f,
              date_cloture_f: converted.date_cloture_f,
            });
          }
          
          return converted;
        }) as Consultation[];
      
      // Ne pas trier car l'API retourne déjà les consultations triées selon les paramètres de pagination
      // Le tri supplémentaire pourrait modifier l'ordre et causer des incohérences
      
      console.log(`Définition de ${convertedConsultations.length} consultations dans le state`);
      if (convertedConsultations.length > 0) {
        console.log('Première consultation dans le state:', {
          cle_dce: convertedConsultations[0].cle_dce,
          identifiant: convertedConsultations[0].identifiant,
          objet: convertedConsultations[0].objet,
          ref_interne: convertedConsultations[0].ref_interne,
          date_creation: convertedConsultations[0].date_creation,
          date_creation_f: convertedConsultations[0].date_creation_f,
        });
      }
      setConsultations(convertedConsultations);
      setTotalResults(result.nb_total);
      setCurrentPage(result.pagination.page);
      setItemsPerPage(result.pagination.nbr_par_page);
      console.log('=== FIN loadConsultationsFromAPI (SUCCÈS) ===');
    } catch (error: any) {
      console.error('=== ERREUR loadConsultationsFromAPI ===');
      console.error('Erreur complète:', error);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      
      // Vérifier si c'est une erreur de token invalide
      const errorMessage = error.message || String(error) || '';
      const lowerMessage = errorMessage.toLowerCase();
      
      if (lowerMessage.includes('token') && (lowerMessage.includes('invalid') || lowerMessage.includes('expiré') || lowerMessage.includes('expired'))) {
        // Nettoyer le token invalide et demander une reconnexion
        try {
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('token_type');
          await AsyncStorage.removeItem('token_expires_in');
          await AsyncStorage.removeItem('isAuthenticated');
        } catch (storageError) {
          console.error('Erreur lors du nettoyage du storage:', storageError);
        }
        Alert.alert(
          'Session expirée', 
          'Votre session a expiré. Veuillez vous reconnecter.',
          [{ text: 'OK' }]
        );
      } else if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
        Alert.alert('Erreur réseau', 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      } else {
        Alert.alert('Erreur', errorMessage || 'Erreur lors du chargement des consultations');
      }
      setConsultations([]);
    } finally {
      setLoadingConsultations(false);
    }
  };

  useEffect(() => {
    // Charger les favoris sauvegardés
    loadFavorites();
  }, []);

  // Charger les consultations depuis l'API selon le type sélectionné
  useEffect(() => {
    const sidebarItemsMap = [
      { fr: 'CONSULTATIONS NOUVELLES', en: 'NEW CONSULTATIONS', de: 'NEUE KONSULTATIONEN', type: 'nouvelles' as const },
      { fr: 'CONSULTATIONS À VALIDER', en: 'CONSULTATIONS TO VALIDATE', de: 'ZU VALIDIERENDE KONSULTATIONEN', type: 'valider' as const },
      { fr: 'CONSULTATIONS EN COURS', en: 'ONGOING CONSULTATIONS', de: 'LAUFENDE KONSULTATIONEN', type: 'enCours' as const },
      { fr: 'CONSULTATIONS CLÔTURÉES', en: 'CLOSED CONSULTATIONS', de: 'ABGESCHLOSSENE KONSULTATIONEN', type: 'cloturees' as const },
    ];
    
    // Trouver le type correspondant à l'élément sélectionné
    const selectedItem = sidebarItemsMap.find(
      item => item.fr === selectedSidebar || item.en === selectedSidebar || item.de === selectedSidebar
    );
    
    if (selectedItem) {
      console.log(`🔄 Chargement des consultations ${selectedItem.type} depuis l'API...`);
      loadConsultationsFromAPI(undefined, selectedItem.type);
    } else {
      console.log('⚠️ Aucun élément sélectionné trouvé, chargement par défaut des nouvelles...');
      loadConsultationsFromAPI(undefined, 'nouvelles');
    }
  }, [selectedSidebar, language]);

  // Charger les favoris depuis AsyncStorage
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        const favoritesArray = JSON.parse(storedFavorites);
        setFavorites(new Set(favoritesArray));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Sauvegarder les favoris dans AsyncStorage
  const saveFavorites = async (favoritesSet: Set<string>) => {
    try {
      const favoritesArray = Array.from(favoritesSet);
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // Toggle favoris pour une consultation
  const toggleFavorite = async (consultationId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(consultationId)) {
      newFavorites.delete(consultationId);
    } else {
      newFavorites.add(consultationId);
    }
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  // Vérifier si une consultation est en favoris
  const isFavorite = (consultationId: string) => {
    return favorites.has(consultationId);
  };

  // Ouvrir le modal d'édition avec les données de la consultation
  const handleEditConsultation = (consultation: Consultation) => {
    // Formater les dates pour les champs de date
    const formatDateForInput = (dateStr: string | undefined) => {
      if (!dateStr) return '';
      // Convertir "18/12/2025" en "18/12/2025" ou "18/12/2025 12:00" en "18/12/2025 12:00"
      return dateStr;
    };

    // Extraire les zones géographiques depuis departements_prestation
    const zones = consultation.departements_prestation 
      ? consultation.departements_prestation.split(',').map(z => z.trim()).filter(z => z)
      : [];
    
    // S'assurer que les zones correspondent au format des départements (avec numéro)
    const formattedZones = zones.map(zone => {
      // Si la zone ne commence pas par un numéro, essayer de la trouver dans la liste
      if (!/^\d{1,3}\s*-/.test(zone)) {
        const found = DEPARTEMENTS.find(d => d.includes(zone) || zone.includes(d.split(' - ')[1]));
        return found || zone;
      }
      return zone;
    });

    // Extraire les emails depuis emails
    const emails = consultation.emails 
      ? consultation.emails.split(',').map(e => e.trim()).filter(e => e)
      : [];

    setEditingConsultation(consultation);
    setEditFormData({
      ref_interne: consultation.ref_interne || '',
      objet: consultation.objet || '',
      consultation_lancee: consultation.finalite_marche || 'Marché(s)',
      type_consultation: consultation.type_pa === 'PA' ? 'Publique (CT et organismes assimilés)' : 
                         consultation.type_pa === 'EA' ? 'Publique (Autres organismes)' : 'Privée',
      type_acheteur: consultation.type_pa === 'PA' ? 'Pouvoir Adjudicateur' : 'Entité Adjudicatrice',
      procedure: consultation.passation_label || '',
      type_prestation: consultation.type_prestation || '',
      date_publication: formatDateForInput(consultation.date_publication_f),
      date_cloture: formatDateForInput(consultation.date_cloture_f),
      mise_en_ligne: consultation.en_ligne === 1 ? 'OUI' : 'NON',
      zones_geo: formattedZones.length > 0 ? formattedZones : [],
      emails: emails.length > 0 ? emails : [''],
    });
    setEditErrors([]);
    setCommonPartsFiles([]); // Réinitialiser les fichiers
    setShowEditModal(true);
  };

  // Valider le formulaire d'édition
  const validateEditForm = () => {
    const errors: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Vérifier la date de clôture
    if (editFormData.date_cloture) {
      const [datePart, timePart] = editFormData.date_cloture.split(' ');
      const [day, month, year] = datePart.split('/');
      const clotureDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      clotureDate.setHours(0, 0, 0, 0);
      
      if (clotureDate < today) {
        errors.push("La date de clôture n'est pas valide: Clôture antérieure à aujourd'hui");
      }
    }

    // Vérifier les champs obligatoires
    if (!editFormData.type_prestation || editFormData.type_prestation.trim() === '') {
      errors.push("Le type de prestation est obligatoire");
    }
    if (!editFormData.procedure || editFormData.procedure.trim() === '') {
      errors.push("La procédure est obligatoire");
    }
    if (!editFormData.objet || editFormData.objet.trim() === '') {
      errors.push("L'objet de la consultation est obligatoire");
    }
    if (editFormData.zones_geo.length === 0 || editFormData.zones_geo.every(z => z.trim() === '')) {
      errors.push("La zone géographique est obligatoire");
    }

    setEditErrors(errors);
    return errors.length === 0;
  };

  // Fonction pour sélectionner un fichier
  const handleAddFile = () => {
    // Pour le web, créer un input file caché
    if (Platform.OS === 'web') {
      const input = document.createElement('input') as HTMLInputElement;
      input.type = 'file';
      input.multiple = true;
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files) {
          const files = Array.from(target.files) as File[];
          const newFiles = files.map(file => ({
            name: file.name,
            size: file.size,
            uri: URL.createObjectURL(file),
          }));
          setCommonPartsFiles([...commonPartsFiles, ...newFiles]);
        }
      };
      input.click();
    } else {
      // Pour mobile, utiliser Alert avec option de sélection
      Alert.alert(
        'Ajouter un fichier',
        'Sélectionnez une option',
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Prendre une photo',
            onPress: () => {
              // Ici vous pouvez intégrer expo-image-picker ou expo-document-picker
              Alert.alert('Info', 'Fonctionnalité à implémenter avec expo-image-picker');
            },
          },
          {
            text: 'Choisir un fichier',
            onPress: () => {
              // Ici vous pouvez intégrer expo-document-picker
              Alert.alert('Info', 'Fonctionnalité à implémenter avec expo-document-picker');
            },
          },
        ]
      );
    }
  };

  // Fonction pour supprimer un fichier
  const handleRemoveFile = (index: number) => {
    const newFiles = commonPartsFiles.filter((_, i) => i !== index);
    setCommonPartsFiles(newFiles);
  };

  // Calculer la taille totale des fichiers
  const calculateTotalSize = () => {
    const totalBytes = commonPartsFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalBytes < 1024) {
      return `${totalBytes} octet${totalBytes > 1 ? 's' : ''}`;
    } else if (totalBytes < 1024 * 1024) {
      return `${(totalBytes / 1024).toFixed(2)} Ko`;
    } else {
      return `${(totalBytes / (1024 * 1024)).toFixed(2)} Mo`;
    }
  };

  // Sauvegarder les modifications
  const handleSaveEdit = () => {
    if (validateEditForm()) {
      // Ici, vous pouvez ajouter la logique pour sauvegarder les modifications
      Alert.alert('Succès', 'Modifications sauvegardées avec succès');
      setShowEditModal(false);
      // Recharger les consultations après sauvegarde
      const sidebarItemsMap = [
        { fr: 'CONSULTATIONS NOUVELLES', en: 'NEW CONSULTATIONS', de: 'NEUE KONSULTATIONEN', type: 'nouvelles' as const },
        { fr: 'CONSULTATIONS À VALIDER', en: 'CONSULTATIONS TO VALIDATE', de: 'ZU VALIDIERENDE KONSULTATIONEN', type: 'valider' as const },
        { fr: 'CONSULTATIONS EN COURS', en: 'ONGOING CONSULTATIONS', de: 'LAUFENDE KONSULTATIONEN', type: 'enCours' as const },
        { fr: 'CONSULTATIONS CLÔTURÉES', en: 'CLOSED CONSULTATIONS', de: 'ABGESCHLOSSENE KONSULTATIONEN', type: 'cloturees' as const },
      ];
      const selectedItem = sidebarItemsMap.find(
        item => item.fr === selectedSidebar || item.en === selectedSidebar || item.de === selectedSidebar
      );
      const consultationType = selectedItem?.type || 'nouvelles';
      loadConsultationsFromAPI(undefined, consultationType);
    }
  };

  // Filtrer les consultations selon la recherche et les favoris
  console.log('DEBUG: consultations.length =', consultations.length);
  console.log('DEBUG: showFavoritesOnly =', showFavoritesOnly);
  console.log('DEBUG: searchQuery =', searchQuery);
  console.log('DEBUG: favorites.size =', favorites.size);
  console.log('DEBUG: selectedSidebar =', selectedSidebar);
  
  let filteredConsultations = consultations.filter((consultation) => {
    const consultationId = consultation.cle_dce || consultation.identifiant || '';
    
    // Filtre favoris : si showFavoritesOnly est activé, ne garder que les favoris
    if (showFavoritesOnly && !favorites.has(consultationId)) {
      return false;
    }
    
    // Filtre recherche : si une recherche est effectuée, filtrer par texte
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        consultation.identifiant?.toLowerCase().includes(query) ||
        consultation.denomination_pa?.toLowerCase().includes(query) ||
        consultation.objet?.toLowerCase().includes(query) ||
        consultation.departements_prestation?.toLowerCase().includes(query)
      );
    }
    
    // Si pas de recherche, retourner toutes les consultations (ou seulement les favoris si le filtre est activé)
    return true;
  });
  
  console.log('DEBUG: filteredConsultations.length =', filteredConsultations.length);
  if (filteredConsultations.length > 0) {
    const firstConsultation = filteredConsultations[0];
    const objetText = firstConsultation.objet && firstConsultation.objet.trim() !== '' 
      ? firstConsultation.objet 
      : (firstConsultation.ref_interne && firstConsultation.ref_interne.trim() !== '' 
          ? firstConsultation.ref_interne 
          : 'AUCUN OBJET SAISI');
    console.log('DEBUG: Première consultation filtrée:', {
      cle_dce: firstConsultation.cle_dce,
      identifiant: firstConsultation.identifiant,
      objet: firstConsultation.objet,
      ref_interne: firstConsultation.ref_interne,
      date_creation: firstConsultation.date_creation,
      date_creation_f: firstConsultation.date_creation_f,
      objetTextAffiché: objetText,
    });
  }


  // Obtenir le statut de la consultation
  const getConsultationStatus = (consultation: Consultation) => {
    if (consultation.etat === 0) return 'waiting';
    // Vous pouvez ajouter d'autres statuts selon les valeurs de 'etat'
    return 'waiting';
  };

  // Obtenir le texte de l'objet ou un texte par défaut
  const getObjetText = (consultation: Consultation) => {
    if (consultation.objet && consultation.objet.trim() !== '') {
      return consultation.objet;
    }
    if (consultation.ref_interne && consultation.ref_interne.trim() !== '') {
      return consultation.ref_interne;
    }
    return 'AUCUN OBJET SAISI';
  };

  // Formater la date au format court (12/11/2025)
  const formatShortDate = (dateString: string) => {
    if (!dateString) return '-';
    // Extraire la date du format "mercredi 12 novembre 2025 - 09:35"
    const parts = dateString.split(' - ');
    if (parts.length > 0) {
      const datePart = parts[0];
      // Extraire jour, mois, année
      const dateMatch = datePart.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
      if (dateMatch) {
        const day = dateMatch[1].padStart(2, '0');
        const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const monthIndex = monthNames.findIndex(m => m.toLowerCase() === dateMatch[2].toLowerCase());
        const month = monthIndex >= 0 ? String(monthIndex + 1).padStart(2, '0') : '01';
        const year = dateMatch[3];
        return `${day}/${month}/${year}`;
      }
    }
    return dateString;
  };

  // Formater la deadline (13/11/2025 at 13 h 00 mn)
  const formatDeadline = (dateString: string) => {
    if (!dateString) return '-';
    // Extraire la date et l'heure du format "jeudi 13 novembre 2025 - 13:00"
    const parts = dateString.split(' - ');
    if (parts.length === 2) {
      const datePart = parts[0];
      const timePart = parts[1];
      const dateMatch = datePart.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
      if (dateMatch) {
        const day = dateMatch[1].padStart(2, '0');
        const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const monthIndex = monthNames.findIndex(m => m.toLowerCase() === dateMatch[2].toLowerCase());
        const month = monthIndex >= 0 ? String(monthIndex + 1).padStart(2, '0') : '01';
        const year = dateMatch[3];
        // Formater l'heure (13:00 -> 13 h 00 mn)
        const timeMatch = timePart.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const hours = timeMatch[1];
          const minutes = timeMatch[2];
          return `${day}/${month}/${year} ${t.at} ${hours} ${t.hours} ${minutes} ${t.minutes}`;
        }
      }
    }
    return dateString;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const locale = language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'en-US';
    const month = now.toLocaleString(locale, { month: 'long' }).toUpperCase();
    const year = now.getFullYear();
    const day = now.getDate();
    return `${month} ${year} ${day}`;
  };

  // Fonction pour obtenir l'heure actuelle
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    // Mettre à jour l'heure toutes les minutes
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Interpolations pour les animations TRÈS réactives du background gris-bleu
  const translateY1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });
  const translateX1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 90],
  });
  const scale1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });
  const opacity1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.9],
  });

  const translateY2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });
  const translateX2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });
  const scale2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.7],
  });
  const opacity2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.85],
  });

  const translateY3 = animatedValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });
  const translateX3 = animatedValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70],
  });
  const scale3 = animatedValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.65],
  });
  const opacity3 = animatedValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.8],
  });

  const translateY4 = animatedValue4.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 90],
  });
  const translateX4 = animatedValue4.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -60],
  });
  const scale4 = animatedValue4.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.6],
  });
  const opacity4 = animatedValue4.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.75],
  });

  return (
    <View style={styles.container}>
      {/* StatusBar translucide pour merger avec la barre */}
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="dark-content" 
      />
      {/* Background Réactif avec animations dynamiques */}
      <View style={styles.backgroundContainer}>
        {/* Gradient de base animé */}
        <Animated.View
          style={[
            styles.gradientBase,
            {
              opacity: animatedValue3.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ]}
        />
        
        {/* Gradient animé TRÈS réactif - Très dynamique et visible */}
        <Animated.View
          style={[
            styles.gradientOverlay,
            {
              opacity: animatedValue1.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 0.9],
              }),
              transform: [
                {
                  scale: animatedValue1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
                  }),
                },
                {
                  translateX: animatedValue1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 50],
                  }),
                },
                {
                  translateY: animatedValue1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -40],
                  }),
                },
                {
                  rotate: animatedValue1.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '10deg'],
                  }),
                },
              ],
            },
          ]}
        />
        
        {/* Lignes de grille animées TRÈS réactives - Très visibles */}
        <Animated.View
          style={[
            styles.gridLines,
            {
              opacity: animatedValue2.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.5],
              }),
              transform: [
                {
                  scale: animatedValue2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  }),
                },
                {
                  rotate: animatedValue2.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '8deg'],
                  }),
                },
                {
                  translateX: animatedValue2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
              ],
            },
          ]}
        />
        
        {/* Particules flottantes orange avec glow */}
        <Animated.View
          style={[
            styles.particle,
            styles.particleOrange1,
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
            styles.particle,
            styles.particleOrange2,
            {
              transform: [
                { translateY: translateY3 },
                { translateX: translateX3 },
                { scale: scale3 },
              ],
              opacity: opacity3,
            },
          ]}
        />
        
        {/* Particules flottantes bleues avec glow */}
        <Animated.View
          style={[
            styles.particle,
            styles.particleBlue1,
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
            styles.particle,
            styles.particleBlue2,
            {
              transform: [
                { translateY: translateY4 },
                { translateX: translateX4 },
                { scale: scale4 },
              ],
              opacity: opacity4,
            },
          ]}
        />
        
        {/* Lignes de connexion animées TRÈS réactives (effet réseau) - Très visibles */}
        <Animated.View
          style={[
            styles.connectionLine,
            styles.line1,
            {
              opacity: animatedValue1.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 0.8],
              }),
              transform: [
                {
                  rotate: animatedValue1.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['45deg', '225deg'],
                  }),
                },
                {
                  scale: animatedValue1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.6],
                  }),
                },
                {
                  translateX: animatedValue1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 60],
                  }),
                },
                {
                  translateY: animatedValue1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.connectionLine,
            styles.line2,
            {
              opacity: animatedValue2.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 0.8],
              }),
              transform: [
                {
                  rotate: animatedValue2.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-45deg', '-225deg'],
                  }),
                },
                {
                  scale: animatedValue2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
                  }),
                },
                {
                  translateX: animatedValue2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -55],
                  }),
                },
                {
                  translateY: animatedValue2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
              ],
            },
          ]}
        />
        
        {/* Effet de lumière pulsante centrale TRÈS réactif - Très visible */}
        <Animated.View
          style={[
            styles.lightPulse,
            {
              opacity: animatedValue3.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.55],
              }),
              transform: [
                { 
                  scale: animatedValue3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 2.2],
                  })
                },
                {
                  translateX: animatedValue3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 50],
                  }),
                },
                {
                  translateY: animatedValue3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -40],
                  }),
                },
                {
                  rotate: animatedValue3.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '15deg'],
                  }),
                },
              ],
            },
          ]}
        />
          </View>

      {/* Contenu par-dessus le background */}
      <View style={styles.contentOverlay}>
      {/* ============================================
          NAVBAR STRUCTURE STRICTE - 6 SECTIONS EXACTES
          ============================================
          SECTION 1: Logo + Heure/Date (12px max)
          SECTION 2: Tags ATLINE + MS 2.0 (8px)
          SECTION 3: Hotline (icône + texte)
          SECTION 4: Boutons Contact + Training (8-12px)
          SECTION 5: Bloc utilisateur (identifiant + rôle)
          SECTION 6: Icônes Settings + Langue (8px)
          ============================================ */}
      <View style={styles.modernNavbar}>
        {/* Container principal : Colonne avec sections espacées de 12-16px */}
        <View style={[styles.navbarColumn, isMobile && styles.navbarColumnMobile]}>
          
          {/* Menu scrollable horizontal - Logo, Date/Heure, MS 2.0, Hotline */}
          <View style={[styles.topMenuWrapper, { paddingTop: statusBarHeight }]}>
            {/* Dégradé de gauche vers droite */}
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
                {logoImageSource && (
                  <Image 
                    source={logoImageSource} 
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

            {/* Sélecteur de langue FR/EN/DE */}
            <View style={styles.topMenuItem}>
              <View style={styles.langSelectorContainer}>
                <TouchableOpacity 
                  style={[styles.langButtonInMenu, language === 'fr' && styles.langButtonInMenuActive]}
                  onPress={() => setLanguage('fr')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.langButtonInMenuText, language === 'fr' && styles.langButtonInMenuTextActive]}>FR</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.langButtonInMenu, language === 'en' && styles.langButtonInMenuActive]}
                  onPress={() => setLanguage('en')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.langButtonInMenuText, language === 'en' && styles.langButtonInMenuTextActive]}>EN</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.langButtonInMenu, language === 'de' && styles.langButtonInMenuActive]}
                  onPress={() => setLanguage('de')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.langButtonInMenuText, language === 'de' && styles.langButtonInMenuTextActive]}>DE</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Séparateur */}
            <View style={styles.menuSeparatorBeforeHotline} />

            {/* Hotline */}
            <View style={styles.topMenuItem}>
              <View style={styles.hotlineCompact}>
                <Text style={styles.hotlineIcon}>📞</Text>
                <Text style={styles.hotlineTextCompact}>{t.hotline} +33 (0)4 92 90 93 27</Text>
              </View>
            </View>
            </ScrollView>
          </View>

          {/* Trait de séparation bleu foncé */}
          <View style={styles.navbarSeparator} />

          {/* Navigation Bar Instagram Style - Scrollable Horizontal */}
          <View style={styles.instagramNavBar}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.instagramNavScroll}
          contentContainerStyle={styles.instagramNavContent}
          bounces={true}
          scrollEnabled={true}
        >
          {navItems.map((item, index) => (
              <TouchableOpacity
              key={`nav-${item}-${index}`}
              style={[
                styles.instagramNavItem,
                selectedNav === item && styles.instagramNavItemActive
              ]}
                onPress={() => setSelectedNav(item)}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.instagramNavText,
                  selectedNav === item && styles.instagramNavTextActive
                ]}
                numberOfLines={1}
              >
                  {item}
                </Text>
              {selectedNav === item && <View style={styles.instagramNavIndicator} />}
              </TouchableOpacity>
            ))}
        </ScrollView>
          </View>

        </View>
      </View>

      {/* Bloc utilisateur compact - Version minimaliste */}
      <View style={[styles.userCardContainerCompact, isMobile && styles.userCardContainerCompactMobile]}>
        <View style={styles.userCardCompact}>
          {/* Informations utilisateur */}
          <View style={styles.userCardCompactInfo}>
            <Text style={styles.userCardCompactName}>M. Hamza BARBARA</Text>
            <Text style={styles.userCardCompactCompany}>Pouvoir Adjudicateur PACOL (06)</Text>
          </View>
          
          {/* Séparateur */}
          <View style={styles.userCardCompactSeparator} />
          
          {/* Icônes */}
          <TouchableOpacity style={styles.userCardCompactIcon} activeOpacity={0.7}>
            <Text style={styles.userCardCompactIconText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.userCardCompactIcon} onPress={onLogout} activeOpacity={0.7}>
            <Text style={styles.userCardCompactIconText}>🔌</Text>
          </TouchableOpacity>
        </View>
        
        {/* Icône menu hamburger à droite, séparée de la carte - Ouvre le menu des consultations */}
        <TouchableOpacity 
          style={styles.userCardMenuIconOutside} 
          onPress={() => setSidebarVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.userCardMenuIconContainer}>
            <Text style={styles.userCardMenuIconText}>☰</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Left Sidebar - Desktop */}
        {!isMobile && (
          <View style={styles.sidebar}>
            {/* Fond décoratif avec effet de profondeur */}
            <View style={styles.sidebarBackgroundPattern} />
            
            <View style={styles.sidebarLogo}>
              <View style={styles.sidebarLogoGlow} />
              {logoImageSource && (
                <Image 
                  source={logoImageSource} 
                  style={styles.sidebarLogoImage}
                  resizeMode="contain"
                />
              )}
            </View>
            
            <View style={styles.sidebarContent}>
              {sidebarItems.map((item, index) => {
                const isFavoritesItem = item.includes('FAVORIS') || item.includes('FAVORITES');
                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.sidebarButton,
                      (selectedSidebar === item || (isFavoritesItem && showFavoritesOnly)) && styles.sidebarButtonSelected
                    ]}
                    onPress={() => {
                      if (isFavoritesItem) {
                        setShowFavoritesOnly(true);
                        setSelectedSidebar(item);
                      } else {
                        setShowFavoritesOnly(false);
                        setSelectedSidebar(item);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    {(selectedSidebar === item || (isFavoritesItem && showFavoritesOnly)) && (
                      <View style={styles.sidebarButtonGlow} />
                    )}
                    <View style={styles.sidebarButtonIcon}>
                      <Text style={[
                        styles.sidebarButtonIconText,
                        (selectedSidebar === item || (isFavoritesItem && showFavoritesOnly)) && styles.sidebarButtonIconTextSelected
                      ]}>
                        {index === 0 ? '📋' : index === 1 ? '📊' : index === 2 ? '📁' : index === 3 ? '📚' : index === 4 ? '⭐' : '🏢'}
                      </Text>
                    </View>
                    <Text style={[
                      styles.sidebarButtonText,
                      (selectedSidebar === item || (isFavoritesItem && showFavoritesOnly)) && styles.sidebarButtonTextSelected
                    ]}>
                      {item}
                    </Text>
                    {(selectedSidebar === item || (isFavoritesItem && showFavoritesOnly)) && (
                      <Text style={styles.sidebarButtonArrow}>→</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Mobile Sidebar Modal */}
        {isMobile && (
          <Modal
            visible={sidebarVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setSidebarVisible(false)}
          >
            <View style={styles.mobileSidebarOverlay}>
              <TouchableOpacity 
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={() => setSidebarVisible(false)}
              />
              <View style={styles.mobileSidebar}>
                <View style={styles.mobileSidebarHeader}>
                  <Text style={styles.mobileSidebarTitle}>{t.menu}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSidebarVisible(false);
                    }}
                    style={styles.mobileSidebarClose}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.mobileSidebarCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
                {/* Fond décoratif */}
                <View style={styles.sidebarBackgroundPattern} />
                
                <View style={styles.sidebarLogo}>
                  <View style={styles.sidebarLogoGlow} />
                  {logoImageSource && (
                    <Image 
                      source={logoImageSource} 
                      style={styles.sidebarLogoImage}
                      resizeMode="contain"
                    />
                  )}
                </View>
                
                <View style={styles.sidebarContent}>
                  {sidebarItems.map((item, index) => {
                    const isFavoritesItem = item.includes('FAVORIS') || item.includes('FAVORITES');
                    return (
                      <TouchableOpacity
                        key={item}
                        style={[
                          styles.sidebarButton,
                          (selectedSidebar === item || (isFavoritesItem && showFavoritesOnly)) && styles.sidebarButtonSelected
                        ]}
                        onPress={() => {
                          if (isFavoritesItem) {
                            setShowFavoritesOnly(true);
                            setSelectedSidebar(item);
                          } else {
                            setShowFavoritesOnly(false);
                            setSelectedSidebar(item);
                          }
                          setSidebarVisible(false);
                        }}
                        activeOpacity={0.7}
                      >
                        {(selectedSidebar === item || (isFavoritesItem && showFavoritesOnly)) && (
                          <View style={styles.sidebarButtonGlow} />
                        )}
                        <View style={styles.sidebarButtonIcon}>
                          <Text style={[
                            styles.sidebarButtonIconText,
                            (selectedSidebar === item || (isFavoritesItem && showFavoritesOnly)) && styles.sidebarButtonIconTextSelected
                          ]}>
                            {index === 0 ? '📋' : index === 1 ? '📊' : index === 2 ? '📁' : index === 3 ? '📚' : index === 4 ? '⭐' : '🏢'}
                          </Text>
                        </View>
                        <Text style={[
                          styles.sidebarButtonText,
                          (selectedSidebar === item || (isFavoritesItem && showFavoritesOnly)) && styles.sidebarButtonTextSelected
                        ]}>
                          {item}
                        </Text>
                        {(selectedSidebar === item || (isFavoritesItem && showFavoritesOnly)) && (
                          <Text style={styles.sidebarButtonArrow}>→</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* Right Content - Scrollable */}
        <View style={styles.contentWrapper}>
          <ScrollView 
            style={styles.contentArea} 
            contentContainerStyle={[
              styles.contentAreaContainer,
              isMobile && { padding: 15, paddingTop: 60 }
            ]}
            showsVerticalScrollIndicator={false}
          >
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <Text style={styles.searchLabel}>{t.search} ({totalResults} {t.results})</Text>
            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchInput}
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => {
                  // Si l'utilisateur n'est pas connecté, rediriger vers les favoris
                  if (!username || username.trim() === '') {
                    setShowFavoritesOnly(true);
                    setSelectedSidebar('⭐ FAVORIS');
                  }
                  // Sinon, la recherche normale se fait via onChangeText du TextInput
                }}
              >
                <Text style={styles.searchIcon}>🔍</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Top Bar with Filters and Create Button */}
          <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
            <View style={[styles.filterSection, isMobile && styles.filterSectionMobile]}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setConsultationType({ ...consultationType, consultations: !consultationType.consultations })}
              >
                <View style={[styles.checkbox, consultationType.consultations && styles.checkboxChecked]}>
                  {consultationType.consultations && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>{t.consultations}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setConsultationType({ ...consultationType, sem: !consultationType.sem })}
              >
                <View style={[styles.checkbox, consultationType.sem && styles.checkboxChecked]}>
                  {consultationType.sem && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>{t.olivi}</Text>
              </TouchableOpacity>
              
              {/* Bouton Favoris */}
              <TouchableOpacity
                style={[
                  styles.favoritesButton,
                  showFavoritesOnly && styles.favoritesButtonActive
                ]}
                onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.favoritesButtonIcon,
                  showFavoritesOnly && styles.favoritesButtonIconActive
                ]}>
                  ⭐
                </Text>
                <Text style={[
                  styles.favoritesButtonText,
                  showFavoritesOnly && styles.favoritesButtonTextActive
                ]}>
                  Favoris
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.createButton, isMobile && styles.createButtonMobile]}>
              <Text style={styles.createButtonIcon}>📁+</Text>
              <Text style={styles.createButtonText}>{t.createConsultation}</Text>
            </TouchableOpacity>
          </View>

          {/* Pagination */}
          <View style={[styles.paginationSection, isMobile && styles.paginationSectionMobile]}>
            {/* Pagination en haut */}
            <View style={[styles.pagination, isMobile && styles.paginationMobile]}>
              <TouchableOpacity 
                style={styles.paginationButton}
                onPress={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                <Text style={[styles.paginationArrow, currentPage === 0 && styles.paginationArrowDisabled]}>←</Text>
              </TouchableOpacity>
              
              {/* Générer les numéros de page intelligemment */}
              {(() => {
                const totalPages = 11; // 0 à 10
                const pages: (number | string)[] = [];
                
                if (currentPage <= 2) {
                  // Afficher 0, 1, 2, 3, 4, ...
                  for (let i = 0; i <= 4; i++) {
                    pages.push(i);
                  }
                  if (totalPages > 5) {
                    pages.push('...');
                    pages.push(totalPages - 1);
                  }
                } else if (currentPage >= totalPages - 3) {
                  // Afficher ..., 6, 7, 8, 9, 10
                  pages.push(0);
                  if (totalPages > 5) {
                    pages.push('...');
                  }
                  for (let i = totalPages - 5; i < totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Afficher 0, ..., page-1, page, page+1, ..., 10
                  pages.push(0);
                  pages.push('...');
                  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                  }
                  pages.push('...');
                  pages.push(totalPages - 1);
                }
                
                return pages.map((item, index) => {
                  if (item === '...') {
                    return (
                      <Text key={`dots-${index}`} style={styles.paginationDots}>...</Text>
                    );
                  }
                  const num = item as number;
                  return (
                    <TouchableOpacity
                      key={num}
                      style={[styles.paginationNumber, num === currentPage && styles.paginationNumberSelected]}
                      onPress={() => setCurrentPage(num)}
                    >
                      <Text style={[styles.paginationText, num === currentPage && styles.paginationTextSelected]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  );
                });
              })()}
              
              <TouchableOpacity 
                style={styles.paginationButton}
                onPress={() => setCurrentPage(Math.min(10, currentPage + 1))}
                disabled={currentPage === 10}
              >
                <Text style={[styles.paginationArrow, currentPage === 10 && styles.paginationArrowDisabled]}>→</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Items per page en dessous de la pagination */}
          <View style={[styles.itemsPerPageSection, isMobile && styles.itemsPerPageSectionMobile]}>
            <View style={[styles.itemsPerPage, isMobile && styles.itemsPerPageMobile]}>
              <Text style={styles.itemsPerPageLabel}>{t.itemsPerPage}</Text>
              <View style={styles.itemsPerPageButtonsContainer}>
                {[10, 20, 30, 40, 50].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[styles.itemsPerPageButton, num === itemsPerPage && styles.itemsPerPageButtonSelected]}
                    onPress={() => setItemsPerPage(num)}
                  >
                    <Text style={[styles.itemsPerPageText, num === itemsPerPage && styles.itemsPerPageTextSelected]}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Consultation Cards */}
          <View style={styles.consultationsList}>
            {loadingConsultations ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>Chargement des consultations...</Text>
              </View>
            ) : filteredConsultations.length === 0 ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>{t.noResults}</Text>
                <Text style={[styles.noResultsText, { fontSize: 12, marginTop: 8, opacity: 0.7 }]}>
                  Total dans le state: {consultations.length} | Filtre favoris: {showFavoritesOnly ? 'OUI' : 'NON'} | Recherche: {searchQuery || '(vide)'}
                </Text>
              </View>
            ) : (
              filteredConsultations.map((consultation, index) => {
                // Log pour la première consultation affichée
                if (index === 0) {
                  const objetText = consultation.objet && consultation.objet.trim() !== '' 
                    ? consultation.objet 
                    : (consultation.ref_interne && consultation.ref_interne.trim() !== '' 
                        ? consultation.ref_interne 
                        : 'AUCUN OBJET SAISI');
                  console.log('=== PREMIÈRE CONSULTATION AFFICHÉE ===');
                  console.log('cle_dce:', consultation.cle_dce);
                  console.log('identifiant:', consultation.identifiant);
                  console.log('objet:', consultation.objet);
                  console.log('ref_interne:', consultation.ref_interne);
                  console.log('objetText:', objetText);
                  console.log('=== FIN PREMIÈRE CONSULTATION AFFICHÉE ===');
                }
                
                return (
                <View 
                  key={consultation.cle_dce || index} 
                  style={[
                    styles.consultationCard,
                    isMobile && styles.consultationCardMobile
                  ]}
                >
                  {/* Barre latérale gauche colorée */}
                  <View style={styles.cardLeftBorder} />
                  
                  {/* Contenu principal */}
                  <View style={styles.cardMainContent}>
                    {/* Header avec titre et actions */}
                    <View style={styles.cardHeader}>
                      <View style={styles.cardTitleSection}>
                        <Text style={styles.cardTitle} numberOfLines={2}>{getObjetText(consultation)}</Text>
                      </View>
                      <View style={styles.cardHeaderActions}>
                        <TouchableOpacity 
                          style={[
                            styles.cardActionButton,
                            isFavorite(consultation.cle_dce || consultation.identifiant || '') && styles.cardActionButtonFavorite
                          ]} 
                          activeOpacity={0.6}
                          onPress={() => toggleFavorite(consultation.cle_dce || consultation.identifiant || '')}
                        >
                          <Text style={[
                            styles.cardActionIcon,
                            isFavorite(consultation.cle_dce || consultation.identifiant || '') && styles.cardActionIconFavorite
                          ]}>
                            {isFavorite(consultation.cle_dce || consultation.identifiant || '') ? '⭐' : '☆'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardActionButton} activeOpacity={0.6}>
                          <Text style={styles.cardActionIcon}>🔗</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.cardActionButton} 
                          activeOpacity={0.6}
                          onPress={() => handleEditConsultation(consultation)}
                        >
                          <Text style={styles.cardActionIcon}>🖊️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cardActionButton} activeOpacity={0.6}>
                          <Text style={styles.cardActionIcon}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Section Référence - Prioritaire */}
                    <View style={styles.cardReferenceSection}>
                      <View style={styles.cardReferenceContent}>
                        <Text style={styles.cardReferenceLabel}>{t.reference}</Text>
                        <Text style={styles.cardReferenceValue} numberOfLines={1}>
                          {consultation.identifiant || '-'}
                        </Text>
                      </View>
                    </View>

                    {/* Informations secondaires en grille */}
                    <View style={styles.cardInfoGrid}>
                      <View style={styles.cardInfoItem}>
                        <View style={styles.cardInfoItemHeader}>
                          <Text style={styles.cardInfoIcon}>👤</Text>
                          <Text style={styles.cardInfoLabel}>{t.shopper}</Text>
                        </View>
                        <Text style={styles.cardInfoValue} numberOfLines={2}>
                          {consultation.denomination_pa || '-'}
                        </Text>
                      </View>
                      <View style={styles.cardInfoItem}>
                        <View style={styles.cardInfoItemHeader}>
                          <Text style={styles.cardInfoIcon}>📍</Text>
                          <Text style={styles.cardInfoLabel}>{t.geoService}</Text>
                        </View>
                        <Text style={styles.cardInfoValue} numberOfLines={2}>
                          {consultation.departements_prestation || '-'}
                        </Text>
                      </View>
                      <View style={styles.cardInfoItem}>
                        <View style={styles.cardInfoItemHeader}>
                          <Text style={styles.cardInfoIcon}>📅</Text>
                          <Text style={styles.cardInfoLabel}>{t.tenderDate}</Text>
                        </View>
                        <Text style={styles.cardInfoValue}>
                          {formatShortDate(consultation.date_publication_f).replace(/\//g, ' / ')}
                        </Text>
                      </View>
                      {consultation.ref_interne && consultation.ref_interne.trim() !== '' ? (
                        <View style={styles.cardInfoItem}>
                          <View style={styles.cardInfoItemHeader}>
                            <Text style={styles.cardInfoIcon}>📋</Text>
                            <Text style={styles.cardInfoLabel}>Réf. interne</Text>
                          </View>
                          <Text style={styles.cardInfoValue} numberOfLines={2}>
                            {consultation.ref_interne}
                          </Text>
                        </View>
                      ) : null}
                      {consultation.type_marche_label && consultation.type_marche_label.trim() !== '' ? (
                        <View style={styles.cardInfoItem}>
                          <View style={styles.cardInfoItemHeader}>
                            <Text style={styles.cardInfoIcon}>🏛️</Text>
                            <Text style={styles.cardInfoLabel}>Type marché</Text>
                          </View>
                          <Text style={styles.cardInfoValue} numberOfLines={2}>
                            {consultation.type_marche_label}
                          </Text>
                        </View>
                      ) : null}
                      {consultation.type_prestation && consultation.type_prestation.trim() !== '' ? (
                        <View style={styles.cardInfoItem}>
                          <View style={styles.cardInfoItemHeader}>
                            <Text style={styles.cardInfoIcon}>🔧</Text>
                            <Text style={styles.cardInfoLabel}>Type prestation</Text>
                          </View>
                          <Text style={styles.cardInfoValue} numberOfLines={2}>
                            {consultation.type_prestation}
                          </Text>
                        </View>
                      ) : null}
                      {consultation.passation_label && consultation.passation_label.trim() !== '' ? (
                        <View style={styles.cardInfoItem}>
                          <View style={styles.cardInfoItemHeader}>
                            <Text style={styles.cardInfoIcon}>📝</Text>
                            <Text style={styles.cardInfoLabel}>Passation</Text>
                          </View>
                          <Text style={styles.cardInfoValue} numberOfLines={2}>
                            {consultation.passation_label}
                          </Text>
                        </View>
                      ) : null}
                      {consultation.nb_lots !== undefined && consultation.nb_lots > 0 ? (
                        <View style={styles.cardInfoItem}>
                          <View style={styles.cardInfoItemHeader}>
                            <Text style={styles.cardInfoIcon}>📦</Text>
                            <Text style={styles.cardInfoLabel}>Nombre de lots</Text>
                          </View>
                          <Text style={styles.cardInfoValue}>
                            {consultation.nb_lots}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    {/* Deadline avec badge de statut - Section prioritaire */}
                    <View style={styles.cardDeadlineSection}>
                      <View style={styles.cardDeadlineContent}>
                        <Text style={styles.cardDeadlineLabel}>{t.deadline} {t.casablancaTime}</Text>
                        <Text style={styles.cardDeadlineValue}>
                          {formatDeadline(consultation.date_cloture_f).replace(/\//g, ' / ')}
                        </Text>
                      </View>
                      <View style={styles.cardStatusBadge}>
                        <Text style={styles.cardStatusText}>{t.waiting}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                );
              })
            )}
          </View>
          </ScrollView>
        </View>
        </View>
      </View>

      {/* Modal d'édition de consultation */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={true}>
              {/* En-tête du modal */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingConsultation?.identifiant || (language === 'fr' ? 'Nouvelle consultation' : language === 'de' ? 'Neue Konsultation' : 'New consultation')} {t.modal.title}
                </Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Informations de résumé - Design High-Tech */}
              <View style={styles.modalSummary}>
                <View style={styles.modalSummaryContainer}>
                  <View style={styles.modalSummaryRow}>
                    <View style={styles.modalSummaryRowContent}>
                      <View style={styles.modalSummaryLabelContainer}>
                        <View style={styles.modalSummaryLabelIcon}>
                          <View style={styles.iconDocument}>
                            <View style={styles.iconDocumentFold} />
                            <View style={styles.iconDocumentLines} />
                          </View>
                        </View>
                        <Text style={styles.modalSummaryLabel}>{t.modal.reference}</Text>
                      </View>
                      <View style={styles.modalSummaryValueContainer}>
                        <Text style={styles.modalSummaryValue}>{editingConsultation?.identifiant || '-'}</Text>
                        <View style={styles.modalSummaryValueGlow} />
                      </View>
                    </View>
                    <View style={styles.modalSummaryRowLine} />
                  </View>
                  
                  <View style={styles.modalSummaryRow}>
                    <View style={styles.modalSummaryRowContent}>
                      <View style={styles.modalSummaryLabelContainer}>
                        <View style={styles.modalSummaryLabelIcon}>
                          <Text style={styles.modalSummaryLabelIconText}>⚙️</Text>
                        </View>
                        <Text style={styles.modalSummaryLabel}>{t.modal.procedure}</Text>
                      </View>
                      <View style={styles.modalSummaryValueContainer}>
                        <Text style={styles.modalSummaryValue}>
                          {editFormData.procedure || t.modal.aucuneProcedure}
                        </Text>
                        <View style={styles.modalSummaryValueGlow} />
                      </View>
                    </View>
                    <View style={styles.modalSummaryRowLine} />
                  </View>
                  
                  <View style={styles.modalSummaryRow}>
                    <View style={styles.modalSummaryRowContent}>
                      <View style={styles.modalSummaryLabelContainer}>
                        <View style={styles.modalSummaryLabelIcon}>
                          <Text style={styles.modalSummaryLabelIconText}>📦</Text>
                        </View>
                        <Text style={styles.modalSummaryLabel}>{t.modal.typePrestation}</Text>
                      </View>
                      <View style={styles.modalSummaryValueContainer}>
                        <Text style={styles.modalSummaryValue}>
                          {editFormData.type_prestation || t.modal.aucunePrestation}
                        </Text>
                        <View style={styles.modalSummaryValueGlow} />
                      </View>
                    </View>
                    <View style={styles.modalSummaryRowLine} />
                  </View>
                  
                  <View style={[styles.modalSummaryRow, styles.modalSummaryRowLast]}>
                    <View style={styles.modalSummaryRowContent}>
                      <View style={styles.modalSummaryLabelContainer}>
                        <View style={styles.modalSummaryLabelIcon}>
                          <View style={styles.iconClock}>
                            <View style={styles.iconClockHands} />
                          </View>
                        </View>
                        <Text style={styles.modalSummaryLabel}>{t.modal.dateCreation}</Text>
                      </View>
                      <View style={styles.modalSummaryValueContainer}>
                        <Text style={styles.modalSummaryValue}>
                          {editingConsultation?.date_creation_f || '-'}
                        </Text>
                        <View style={styles.modalSummaryValueGlow} />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Messages d'erreur */}
              {editErrors.length > 0 && (
                <View style={styles.modalErrors}>
                  <Text style={styles.modalErrorIcon}>ℹ️</Text>
                  <View style={styles.modalErrorsList}>
                    {editErrors.map((error, index) => (
                      <Text key={index} style={styles.modalErrorText}>{error}</Text>
                    ))}
                  </View>
                </View>
              )}

              {/* Formulaire */}
              <View style={styles.modalForm}>
                {/* Référence interne */}
                <View style={styles.modalFormField}>
                  <Text style={styles.modalFormLabel}>{t.modal.refInterne}</Text>
                  <TextInput
                    style={[
                      styles.modalFormInput,
                      focusedInput === 'ref_interne' && styles.modalFormInputFocused
                    ]}
                    value={editFormData.ref_interne}
                    onChangeText={(text) => setEditFormData({ ...editFormData, ref_interne: text })}
                    placeholder={t.modal.refInterne}
                    onFocus={() => setFocusedInput('ref_interne')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                {/* Objet de la consultation */}
                <View style={styles.modalFormField}>
                  <Text style={[styles.modalFormLabel, styles.modalFormLabelRequired]}>
                    {t.modal.objet}*
                  </Text>
                  <TextInput
                    style={[
                      styles.modalFormInput,
                      styles.modalFormTextArea,
                      focusedInput === 'objet' && styles.modalFormInputFocused
                    ]}
                    value={editFormData.objet}
                    onChangeText={(text) => setEditFormData({ ...editFormData, objet: text })}
                    placeholder={t.modal.objet}
                    multiline
                    numberOfLines={4}
                    onFocus={() => setFocusedInput('objet')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                {/* Rattacher cette consultation à un groupe */}
                <View style={styles.modalFormField}>
                  <Text style={[styles.modalFormLabel, styles.modalFormLabelRequired]}>
                    {t.modal.rattacherGroupe}
                  </Text>
                  
                  {/* Consultation lancée en vue de conclure */}
                  <Text style={styles.modalFormSubLabel}>{t.modal.consultationLancee}</Text>
                  <View style={styles.modalRadioGroup}>
                    {['Marché(s)', 'Accord(s)-Cadre(s)', 'Concession(s)', 'Autre(s)', 'Suivi de marché'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.modalRadioOption,
                          editFormData.consultation_lancee === option && styles.modalRadioOptionSelected
                        ]}
                        onPress={() => setEditFormData({ ...editFormData, consultation_lancee: option })}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.modalRadio,
                          editFormData.consultation_lancee === option && styles.modalRadioActive
                        ]}>
                          {editFormData.consultation_lancee === option && (
                            <View style={styles.modalRadioSelected} />
                          )}
                        </View>
                        <Text style={[
                          styles.modalRadioLabel,
                          editFormData.consultation_lancee === option && styles.modalRadioLabelSelected
                        ]}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Type de consultation */}
                  <Text style={styles.modalFormSubLabel}>{t.modal.typeConsultation}</Text>
                  <View style={styles.modalRadioGroup}>
                    {['Publique (CT et organismes assimilés)', 'Publique (Autres organismes)', 'Privée'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.modalRadioOption,
                          editFormData.type_consultation === option && styles.modalRadioOptionSelected
                        ]}
                        onPress={() => setEditFormData({ ...editFormData, type_consultation: option })}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.modalRadio,
                          editFormData.type_consultation === option && styles.modalRadioActive
                        ]}>
                          {editFormData.type_consultation === option && (
                            <View style={styles.modalRadioSelected} />
                          )}
                        </View>
                        <Text style={[
                          styles.modalRadioLabel,
                          editFormData.type_consultation === option && styles.modalRadioLabelSelected
                        ]}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Type de l'acheteur */}
                  <Text style={styles.modalFormSubLabel}>{t.modal.typeAcheteur}</Text>
                  <View style={styles.modalRadioGroup}>
                    {['Pouvoir Adjudicateur', 'Entité Adjudicatrice'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.modalRadioOption,
                          editFormData.type_acheteur === option && styles.modalRadioOptionSelected
                        ]}
                        onPress={() => setEditFormData({ ...editFormData, type_acheteur: option })}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.modalRadio,
                          editFormData.type_acheteur === option && styles.modalRadioActive
                        ]}>
                          {editFormData.type_acheteur === option && (
                            <View style={styles.modalRadioSelected} />
                          )}
                        </View>
                        <Text style={[
                          styles.modalRadioLabel,
                          editFormData.type_acheteur === option && styles.modalRadioLabelSelected
                        ]}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Procédure */}
                  <Text style={[styles.modalFormSubLabel, styles.modalFormLabelRequired]}>{t.modal.procedure}*</Text>
                  <TextInput
                    style={[
                      styles.modalFormInput,
                      focusedInput === 'procedure' && styles.modalFormInputFocused
                    ]}
                    value={editFormData.procedure}
                    onChangeText={(text) => setEditFormData({ ...editFormData, procedure: text })}
                    placeholder="Sélectionner une procédure"
                    onFocus={() => setFocusedInput('procedure')}
                    onBlur={() => setFocusedInput(null)}
                  />

                  {/* Type de prestation */}
                  <Text style={[styles.modalFormSubLabel, styles.modalFormLabelRequired]}>{t.modal.typePrestation}*</Text>
                  <View style={styles.modalRadioGroup}>
                    {['Travaux', 'Services', 'Fournitures'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.modalRadioOption,
                          editFormData.type_prestation === option && styles.modalRadioOptionSelected
                        ]}
                        onPress={() => setEditFormData({ ...editFormData, type_prestation: option })}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.modalRadio,
                          editFormData.type_prestation === option && styles.modalRadioActive
                        ]}>
                          {editFormData.type_prestation === option && (
                            <View style={styles.modalRadioSelected} />
                          )}
                        </View>
                        <Text style={[
                          styles.modalRadioLabel,
                          editFormData.type_prestation === option && styles.modalRadioLabelSelected
                        ]}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Dates - Design High-Tech */}
                  <View style={styles.modalDateRow}>
                    <View style={styles.modalDateField}>
                      <View style={styles.modalDateFieldHeader}>
                        <View style={styles.modalDateIconContainer}>
                          <View style={styles.iconCalendar}>
                            <View style={styles.iconCalendarTop} />
                            <View style={styles.iconCalendarGrid} />
                          </View>
                        </View>
                        <Text style={styles.modalDateLabel}>{t.modal.datePublication.toUpperCase()}</Text>
                      </View>
                      <View style={styles.modalDateInputContainer}>
                        <TextInput
                          style={[
                            styles.modalDateInput,
                            focusedInput === 'date_publication' && styles.modalDateInputFocused
                          ]}
                          value={editFormData.date_publication}
                          onChangeText={(text) => setEditFormData({ ...editFormData, date_publication: text })}
                          placeholder="jj/mm/yyyy"
                          placeholderTextColor="#999"
                          onFocus={() => setFocusedInput('date_publication')}
                          onBlur={() => setFocusedInput(null)}
                        />
                        <View style={[
                          styles.modalDateInputGlow,
                          focusedInput === 'date_publication' && styles.modalDateInputGlowActive
                        ]} />
                      </View>
                      <Text style={styles.modalDateHint}>Format: jj/mm/yyyy</Text>
                    </View>
                    
                    <View style={styles.modalDateSeparator} />
                    
                    <View style={styles.modalDateField}>
                      <View style={styles.modalDateFieldHeader}>
                        <View style={[styles.modalDateIconContainer, styles.modalDateIconContainerUrgent]}>
                          <View style={styles.iconClockUrgent}>
                            <View style={styles.iconClockHandsUrgent} />
                          </View>
                        </View>
                        <Text style={styles.modalDateLabel}>{t.modal.dateCloture.toUpperCase()}</Text>
                      </View>
                      <View style={styles.modalDateInputContainer}>
                        <TextInput
                          style={[
                            styles.modalDateInput,
                            focusedInput === 'date_cloture' && styles.modalDateInputFocused
                          ]}
                          value={editFormData.date_cloture}
                          onChangeText={(text) => setEditFormData({ ...editFormData, date_cloture: text })}
                          placeholder="jj/mm/yyyy hh:mm"
                          placeholderTextColor="#999"
                          onFocus={() => setFocusedInput('date_cloture')}
                          onBlur={() => setFocusedInput(null)}
                        />
                        <View style={[
                          styles.modalDateInputGlow,
                          focusedInput === 'date_cloture' && styles.modalDateInputGlowActive
                        ]} />
                      </View>
                      <Text style={styles.modalDateHint}>Format: jj/mm/yyyy hh:mm</Text>
                    </View>
                  </View>

                  {/* Mise en ligne */}
                  <Text style={styles.modalFormSubLabel}>{t.modal.miseEnLigne}</Text>
                  <View style={styles.modalRadioGroup}>
                    {['OUI', 'NON'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.modalRadioOption,
                          editFormData.mise_en_ligne === option && styles.modalRadioOptionSelected
                        ]}
                        onPress={() => setEditFormData({ ...editFormData, mise_en_ligne: option })}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.modalRadio,
                          editFormData.mise_en_ligne === option && styles.modalRadioActive
                        ]}>
                          {editFormData.mise_en_ligne === option && (
                            <View style={styles.modalRadioSelected} />
                          )}
                        </View>
                        <Text style={[
                          styles.modalRadioLabel,
                          editFormData.mise_en_ligne === option && styles.modalRadioLabelSelected
                        ]}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Zones géographiques */}
                  <Text style={[styles.modalFormSubLabel, styles.modalFormLabelRequired]}>
                    {t.modal.zonesGeo}*
                  </Text>
                  
                  {/* Bouton pour ouvrir le sélecteur */}
                  <TouchableOpacity
                    style={styles.modalZoneSelectorButton}
                    onPress={() => setShowZonePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalZoneSelectorButtonText}>
                      {editFormData.zones_geo.length > 0 
                        ? `${editFormData.zones_geo.length} zone(s) sélectionnée(s)` 
                        : 'Sélectionner des zones géographiques'}
                    </Text>
                    <Text style={styles.modalZoneSelectorArrow}>▼</Text>
                  </TouchableOpacity>

                  {/* Zones sélectionnées affichées */}
                  {editFormData.zones_geo.length > 0 && (
                    <View style={styles.modalSelectedZonesContainer}>
                      {editFormData.zones_geo.map((zone, index) => (
                        <View key={index} style={styles.modalSelectedZoneTag}>
                          <Text style={styles.modalSelectedZoneText}>{zone}</Text>
                          <TouchableOpacity
                            style={styles.modalSelectedZoneDelete}
                            onPress={() => {
                              const newZones = editFormData.zones_geo.filter((_, i) => i !== index);
                              setEditFormData({ ...editFormData, zones_geo: newZones });
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.modalSelectedZoneDeleteText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Modal de sélection des zones */}
                  <Modal
                    visible={showZonePicker}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowZonePicker(false)}
                  >
                    <View style={styles.modalZonePickerOverlay}>
                      <View style={styles.modalZonePickerContent}>
                        <View style={styles.modalZonePickerHeader}>
                          <Text style={styles.modalZonePickerTitle}>{t.modal.selectionnerZones}</Text>
                          <TouchableOpacity
                            style={styles.modalZonePickerClose}
                            onPress={() => setShowZonePicker(false)}
                          >
                            <Text style={styles.modalZonePickerCloseText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalZonePickerList}>
                          {DEPARTEMENTS.map((dept) => {
                            const isSelected = editFormData.zones_geo.includes(dept);
                            return (
                              <TouchableOpacity
                                key={dept}
                                style={[
                                  styles.modalZonePickerItem,
                                  isSelected && styles.modalZonePickerItemSelected
                                ]}
                                onPress={() => {
                                  if (isSelected) {
                                    // Désélectionner
                                    setEditFormData({
                                      ...editFormData,
                                      zones_geo: editFormData.zones_geo.filter(z => z !== dept),
                                    });
                                  } else {
                                    // Sélectionner
                                    setEditFormData({
                                      ...editFormData,
                                      zones_geo: [...editFormData.zones_geo, dept],
                                    });
                                  }
                                }}
                                activeOpacity={0.7}
                              >
                                <View style={[
                                  styles.modalZonePickerCheckbox,
                                  isSelected && styles.modalZonePickerCheckboxSelected
                                ]}>
                                  {isSelected && <Text style={styles.modalZonePickerCheckmark}>✓</Text>}
                                </View>
                                <Text style={[
                                  styles.modalZonePickerItemText,
                                  isSelected && styles.modalZonePickerItemTextSelected
                                ]}>{dept}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                        <View style={styles.modalZonePickerFooter}>
                          <TouchableOpacity
                            style={styles.modalZonePickerDoneButton}
                            onPress={() => setShowZonePicker(false)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.modalZonePickerDoneText}>
                              {t.modal.valider} ({editFormData.zones_geo.length})
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>

                  {/* Emails */}
                  <Text style={styles.modalFormSubLabel}>
                    {t.modal.emails}
                  </Text>
                  {editFormData.emails.map((email, index) => (
                    <View key={index} style={styles.modalMultiInputRow}>
                      <TextInput
                        style={[
                          styles.modalFormInput,
                          styles.modalFormInputFlex,
                          focusedInput === `email_${index}` && styles.modalFormInputFocused
                        ]}
                        value={email}
                        onChangeText={(text) => {
                          const newEmails = [...editFormData.emails];
                          newEmails[index] = text;
                          setEditFormData({ ...editFormData, emails: newEmails });
                        }}
                        placeholder="email@example.com"
                        keyboardType="email-address"
                        onFocus={() => setFocusedInput(`email_${index}`)}
                        onBlur={() => setFocusedInput(null)}
                      />
                      {index < editFormData.emails.length - 1 ? (
                        <TouchableOpacity
                          style={styles.modalDeleteButton}
                          onPress={() => {
                            const newEmails = editFormData.emails.filter((_, i) => i !== index);
                            setEditFormData({ ...editFormData, emails: newEmails });
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.modalDeleteIcon}>🗑️</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.modalAddButton}
                          onPress={() => {
                            setEditFormData({
                              ...editFormData,
                              emails: [...editFormData.emails, ''],
                            });
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.modalAddIcon}>+</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>

                {/* Pièces Communes */}
                <View style={styles.modalCommonPartsSection}>
                  <View style={styles.modalCommonPartsHeader}>
                    <View style={styles.modalCommonPartsTitleContainer}>
                      <Text style={styles.modalCommonPartsTitle}>{t.modal.piecesCommunes}</Text>
                      <Text style={styles.modalCommonPartsSize}>
                        {commonPartsFiles.length > 0 ? calculateTotalSize() : '0 octet'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.modalCommonPartsChevron}
                      onPress={() => {
                        // Toggle expand/collapse
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.modalCommonPartsChevronIcon}>▲</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.modalCommonPartsContent}>
                    {commonPartsFiles.length === 0 ? (
                      <View style={styles.modalCommonPartsMessageContainer}>
                        <Text style={styles.modalCommonPartsMessage}>
                          {t.modal.aucunePiece}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.modalCommonPartsFilesList}>
                        {commonPartsFiles.map((file, index) => (
                          <View key={index} style={styles.modalCommonPartsFileItem}>
                            <View style={styles.modalCommonPartsFileInfo}>
                              <Text style={styles.modalCommonPartsFileName} numberOfLines={1}>
                                {file.name}
                              </Text>
                              <Text style={styles.modalCommonPartsFileSize}>
                                {file.size < 1024 
                                  ? `${file.size} octet${file.size > 1 ? 's' : ''}`
                                  : file.size < 1024 * 1024
                                  ? `${(file.size / 1024).toFixed(2)} Ko`
                                  : `${(file.size / (1024 * 1024)).toFixed(2)} Mo`}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={styles.modalCommonPartsFileDelete}
                              onPress={() => handleRemoveFile(index)}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.modalCommonPartsFileDeleteIcon}>✕</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                    
                    <View style={styles.modalCommonPartsActions}>
                      <TouchableOpacity
                        style={styles.modalCommonPartsAddButton}
                        onPress={handleAddFile}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.modalCommonPartsAddIcon}>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalCommonPartsValidateButton}
                        onPress={() => {
                          Alert.alert('Succès', 'Pièces communes validées');
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.modalCommonPartsValidateIcon}>✓</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Bouton Sauvegarder */}
                <View style={styles.modalSaveButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalSaveButtonIcon}
                    onPress={handleSaveEdit}
                    activeOpacity={0.8}
                  >
                    <View style={styles.modalSaveButtonIconInner}>
                      <Text style={styles.modalSaveButtonDiskIcon}>💾</Text>
                      <Text style={styles.modalSaveButtonCount}>{commonPartsFiles.length}</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Boutons d'action */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowEditModal(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalCancelText}>{t.modal.annuler}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalSaveButton}
                    onPress={handleSaveEdit}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalSaveText}>{t.modal.enregistrer}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f2e',
    position: 'relative',
    overflow: 'hidden',
  },
  // ============================================
  // BACKGROUND RÉACTIF AVEC ANIMATIONS DYNAMIQUES
  // ============================================
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  // Gradient de base animé - Fond dark avec nuances gris-bleu
  gradientBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1f2e',
  },
  // Gradient overlay animé réactif - Tons bleu-gris
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 35, 126, 0.15)',
  },
  // Grille de lignes animées réactives - Tons gris-bleu
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  // Particules flottantes réactives - Style dark avec tons gris-bleu
  particle: {
    position: 'absolute',
    borderRadius: 1000,
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 5,
  },
  particleOrange1: {
    width: 250,
    height: 250,
    backgroundColor: 'rgba(96, 125, 139, 0.12)',
    top: '8%',
    right: '8%',
    shadowColor: 'rgba(96, 125, 139, 0.4)',
  },
  particleOrange2: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(69, 90, 100, 0.1)',
    top: '55%',
    right: '12%',
    shadowColor: 'rgba(69, 90, 100, 0.3)',
    shadowOpacity: 0.4,
  },
  particleBlue1: {
    width: 220,
    height: 220,
    backgroundColor: 'rgba(26, 35, 126, 0.15)',
    bottom: '15%',
    left: '5%',
    shadowColor: 'rgba(26, 35, 126, 0.4)',
    shadowOpacity: 0.25,
  },
  particleBlue2: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(38, 50, 56, 0.12)',
    top: '35%',
    left: '2%',
    shadowColor: 'rgba(38, 50, 56, 0.3)',
    shadowOpacity: 0.2,
  },
  // Lignes de connexion animées réactives - Tons gris-bleu
  connectionLine: {
    position: 'absolute',
    backgroundColor: 'rgba(96, 125, 139, 0.2)',
    opacity: 0.5,
    shadowColor: '#607d8b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  line1: {
    width: 400,
    height: 2,
    top: '25%',
    left: '10%',
    borderRadius: 1,
  },
  line2: {
    width: 350,
    height: 2,
    bottom: '25%',
    right: '10%',
    backgroundColor: 'rgba(26, 35, 126, 0.25)',
    borderRadius: 1,
    shadowColor: '#1a237e',
    shadowOpacity: 0.3,
  },
  // Effet de lumière pulsante centrale réactif - Tons bleu-gris
  lightPulse: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(26, 35, 126, 0.08)',
    top: '50%',
    left: '50%',
    marginLeft: -250,
    marginTop: -250,
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 70,
    elevation: 6,
  },
  // Contenu par-dessus le background
  contentOverlay: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  // ============================================
  // NAVBAR STRUCTURE STRICTE - 6 SECTIONS EXACTES
  // ============================================
  // Container principal : Fond sombre high-tech avec effets glow
  modernNavbar: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  // Colonne principale : flex-direction column avec espacements verticaux 12-16px
  navbarColumn: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 0,
    gap: 0, // Pas d'espacement pour coller les barres
  },
  navbarColumnMobile: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    gap: 0,
  },
  // Menu scrollable horizontal en haut - Style Instagram avec dégradé gris bleuté
  topMenuWrapper: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: -16,
    marginRight: -16,
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
  menuSeparatorBeforeHotline: {
    width: 1,
    height: 24,
    backgroundColor: '#999999',
    marginHorizontal: 0,
    marginRight: 4,
    opacity: 0.4,
    alignSelf: 'center',
  },
  // SECTION 1 : Header - Logo + Heure/Date (12px max entre eux)
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Espacement horizontal max 12px
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
  // SECTION 2 : Tags - ATLINE TENDER + MS 2.0 (8px entre eux)
  sectionTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Spacing strict 8px entre les tags
  },
  atlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffe0b2',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#e65100',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  msBadge: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  msBadgeText: {
    color: '#262626',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  // SECTION 3 : Hotline - Icône + Texte (une seule ligne)
  sectionHotline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hotlineCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
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
  // Bouton CONTACT US
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
  // Bouton ACCESS THE TRAINING SCHEDULE
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
  // SECTION 4 : Boutons d'action - Contact + Training (8-12px entre eux)
  sectionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Espacement horizontal 8-12px
  },
  modernButtonCompact: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  trainingButtonCompact: {
    backgroundColor: '#ff9800',
    shadowColor: '#ff9800',
  },
  modernButtonTextCompact: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Bloc utilisateur compact - Version minimaliste
  userCardContainerCompact: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    zIndex: 999,
  },
  userCardMenuIconOutside: {
    zIndex: 1000,
  },
  userCardMenuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#9fa8b8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  userCardMenuIconText: {
    fontSize: 18,
    color: '#1a237e',
    fontWeight: '700',
  },
  userCardContainerCompactMobile: {
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  userCardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  userCardCompactMenuIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#d4dce8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  userCardCompactMenuIconText: {
    fontSize: 14,
    color: '#1a237e',
    fontWeight: '600',
  },
  userCardCompactInfo: {
    flexDirection: 'column',
    marginRight: 8,
  },
  userCardCompactName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a237e',
    lineHeight: 18,
  },
  userCardCompactCompany: {
    fontSize: 11,
    fontWeight: '400',
    color: '#757575',
    lineHeight: 16,
    marginTop: 2,
  },
  userCardCompactSeparator: {
    width: 1,
    height: 16,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  userCardCompactIcon: {
    padding: 4,
    marginLeft: 4,
  },
  userCardCompactIconText: {
    fontSize: 16,
    color: '#1a237e',
  },
  // SECTION 6 : Bouton Langue uniquement - Design moderne
  sectionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  langButtonCompact: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 50,
    alignItems: 'center',
  },
  langButtonTextCompact: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  iconButtonCompact: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff9800',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  iconButtonTextCompact: {
    fontSize: 14,
    color: '#ff9800',
  },
  // ============================================
  // TRAIT DE SÉPARATION BLEU FONCÉ
  // ============================================
  navbarSeparator: {
    height: 2,
    backgroundColor: '#1a237e',
    width: '100%',
    zIndex: 997,
    marginLeft: -16,
    marginRight: -16,
    alignSelf: 'stretch',
  },
  langSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 2,
  },
  langButtonInMenu: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langButtonInMenuActive: {
    backgroundColor: '#1a237e',
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  langButtonInMenuText: {
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    lineHeight: 14,
  },
  langButtonInMenuTextActive: {
    color: '#ffffff',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  langButtonOnSeparator: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
    minWidth: 38,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    top: -9,
    zIndex: 1000,
  },
  langButtonOnSeparatorText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    lineHeight: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // ============================================
  // NAVIGATION BAR INSTAGRAM STYLE
  // ============================================
  instagramNavBar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    marginLeft: -16,
    marginRight: -16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 998,
    position: 'relative',
  },
  instagramNavScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  instagramNavContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 4,
  },
  instagramNavItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 32,
    marginHorizontal: 2,
  },
  instagramNavItemActive: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  instagramNavText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8e8e8e',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  instagramNavTextActive: {
    color: '#262626',
    fontWeight: '700',
  },
  instagramNavIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 2,
    backgroundColor: '#262626',
    borderRadius: 1,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    minHeight: 0,
  },
  mobileMenuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
    backgroundColor: '#ff9800',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mobileMenuIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  sidebar: {
    width: 260,
    backgroundColor: '#0a0e27',
    borderRightWidth: 4,
    borderRightColor: '#ff9800',
    padding: 0,
    flexShrink: 0,
    shadowColor: '#ff9800',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  mobileSidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  mobileSidebar: {
    width: 300,
    backgroundColor: '#0a0e27',
    height: '100%',
    padding: 0,
    borderRightWidth: 4,
    borderRightColor: '#ff9800',
    shadowColor: '#ff9800',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  mobileSidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    padding: 24,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#ff9800',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  mobileSidebarTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ff9800',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 152, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    textTransform: 'uppercase',
  },
  mobileSidebarClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff9800',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  mobileSidebarCloseText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '900',
  },
  contentWrapper: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
  },
  sidebarLogo: {
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 32,
    marginTop: 24,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ff9800',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  sidebarLogoImage: {
    width: 50,
    height: 50,
  },
  sidebarButton: {
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  sidebarButtonSelected: {
    backgroundColor: 'rgba(255, 152, 0, 0.15)',
    borderLeftColor: '#ff9800',
    borderColor: '#ff9800',
    borderWidth: 2,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  sidebarButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b0b0b0',
    letterSpacing: 0.5,
    flex: 1,
  },
  sidebarButtonTextSelected: {
    color: '#ff9800',
    fontWeight: '900',
    textShadowColor: 'rgba(255, 152, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  sidebarBackgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 152, 0, 0.03)',
    opacity: 0.5,
  },
  sidebarLogoGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    top: -10,
    left: -10,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  sidebarContent: {
    paddingTop: 8,
  },
  sidebarButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sidebarButtonIconText: {
    fontSize: 16,
  },
  sidebarButtonIconTextSelected: {
    fontSize: 18,
  },
  sidebarButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 12,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  sidebarButtonArrow: {
    fontSize: 18,
    color: '#ff9800',
    fontWeight: '900',
    marginLeft: 8,
  },
  contentArea: {
    flex: 1,
  },
  contentAreaContainer: {
    padding: 20,
    paddingTop: -10,
    backgroundColor: 'transparent',
  },
  topBarMobile: {
    flexDirection: 'column',
    gap: 15,
    alignItems: 'stretch',
  },
  filterSectionMobile: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  createButtonMobile: {
    width: '100%',
    justifyContent: 'center',
  },
  searchSection: {
    marginBottom: 20,
    marginTop: -10,
    width: '100%',
  },
  searchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e0e0e0',
    marginBottom: 10,
    textShadowColor: 'rgba(255, 152, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  searchBar: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#ff9800',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    padding: 14,
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff9800',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  searchIcon: {
    fontSize: 18,
    color: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    flexWrap: 'wrap',
    gap: 15,
    width: '100%',
  },
  filterSection: {
    flexDirection: 'row',
    gap: 25,
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#ff9800',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  checkboxChecked: {
    backgroundColor: '#ff9800',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  checkmark: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#e0e0e0',
    fontWeight: '500',
  },
  favoritesFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  favoritesFilterButtonActive: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
  },
  favoritesFilterIcon: {
    fontSize: 18,
    color: '#e0e0e0',
  },
  favoritesFilterIconActive: {
    color: '#ff9800',
  },
  favoritesFilterText: {
    fontSize: 13,
    color: '#e0e0e0',
    fontWeight: '500',
  },
  favoritesFilterTextActive: {
    color: '#ff9800',
    fontWeight: '600',
  },
  sortButtonContainer: {
    position: 'relative',
  },
  sortMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 200,
    zIndex: 1000,
  },
  sortMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortMenuItemLast: {
    borderBottomWidth: 0,
  },
  sortMenuItemText: {
    fontSize: 13,
    color: '#2c3e50',
    fontWeight: '500',
  },
  sortMenuCheck: {
    fontSize: 16,
    color: '#ff9800',
    fontWeight: 'bold',
  },
  sortMenuOverlay: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 998,
    backgroundColor: 'transparent',
  },
  favoritesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  favoritesButtonActive: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
  },
  favoritesButtonIcon: {
    fontSize: 18,
    color: '#e0e0e0',
  },
  favoritesButtonIconActive: {
    color: '#ff9800',
  },
  favoritesButtonText: {
    fontSize: 13,
    color: '#e0e0e0',
    fontWeight: '500',
  },
  favoritesButtonTextActive: {
    color: '#ff9800',
    fontWeight: '600',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff9800',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  createButtonIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#fff',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  paginationSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    width: '100%',
    alignSelf: 'center',
  },
  paginationSectionMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexWrap: 'wrap',
    width: '100%',
    alignSelf: 'center',
  },
  paginationMobile: {
    justifyContent: 'center',
    gap: 4,
  },
  paginationButton: {
    padding: 8,
  },
  paginationArrowDisabled: {
    opacity: 0.3,
    color: '#666',
  },
  paginationNumber: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  paginationNumberSelected: {
    backgroundColor: '#ff9800',
    borderColor: '#ff9800',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  paginationText: {
    fontSize: 14,
    color: '#e0e0e0',
    fontWeight: '500',
  },
  paginationTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationDots: {
    fontSize: 14,
    color: '#ff9800',
    paddingHorizontal: 4,
    fontWeight: 'bold',
  },
  paginationArrow: {
    fontSize: 16,
    color: '#ff9800',
    fontWeight: 'bold',
  },
  itemsPerPageSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    width: '100%',
    alignSelf: 'center',
  },
  itemsPerPageSectionMobile: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  itemsPerPage: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    alignSelf: 'center',
  },
  itemsPerPageMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  itemsPerPageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  itemsPerPageLabel: {
    fontSize: 12,
    color: '#e0e0e0',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  itemsPerPageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 35,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  itemsPerPageButtonSelected: {
    backgroundColor: '#ff9800',
    borderColor: '#ff9800',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  itemsPerPageText: {
    fontSize: 12,
    color: '#e0e0e0',
    fontWeight: '500',
  },
  itemsPerPageTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  consultationsList: {
    marginTop: 5,
    width: '100%',
  },
  consultationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    alignSelf: 'stretch',
    maxWidth: '100%',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
  },
  consultationCardMobile: {
    marginBottom: 12,
  },
  cardLeftBorder: {
    width: 3,
    backgroundColor: '#ff9800',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  cardMainContent: {
    flex: 1,
    padding: 20,
    paddingLeft: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    lineHeight: 24,
    letterSpacing: 0,
  },
  cardHeaderActions: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
  },
  cardActionButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  cardActionIcon: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  cardActionButtonFavorite: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
  },
  cardActionIconFavorite: {
    color: '#ff9800',
  },
  // Section Référence - Prioritaire
  cardReferenceSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderLeftWidth: 3,
    borderLeftColor: '#ff9800',
    paddingLeft: 12,
  },
  cardReferenceContent: {
    flex: 1,
  },
  cardReferenceLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#95a5a6',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardReferenceValue: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: 0,
  },
  // Informations secondaires
  cardInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 20,
  },
  cardInfoItem: {
    flex: 1,
    minWidth: '45%',
  },
  cardInfoItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  cardInfoIcon: {
    fontSize: 14,
  },
  cardInfoLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#95a5a6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardInfoValue: {
    fontSize: 14,
    color: '#34495e',
    fontWeight: '400',
    lineHeight: 20,
  },
  // Deadline Section - Prioritaire
  cardDeadlineSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderLeftWidth: 3,
    borderLeftColor: '#ff9800',
  },
  cardDeadlineContent: {
    flex: 1,
  },
  cardDeadlineLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#95a5a6',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDeadlineValue: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '600',
    lineHeight: 22,
  },
  cardStatusBadge: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 12,
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
  noResults: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 152, 0, 0.3)',
    borderStyle: 'dashed',
  },
  noResultsText: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  // Styles pour le modal d'édition - Design amélioré
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    maxWidth: 900,
    maxHeight: '95%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 15,
    overflow: 'hidden',
  },
  modalScrollView: {
    maxHeight: '95%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: '#1a237e',
    borderBottomWidth: 4,
    borderBottomColor: '#ff9800',
    position: 'relative',
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#ffffff',
    flex: 1,
    letterSpacing: 0.5,
    lineHeight: 26,
    textShadowColor: 'rgba(255, 152, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#ff9800',
    borderWidth: 2,
    borderColor: '#ff6f00',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    lineHeight: 18,
  },
  modalSummary: {
    padding: 0,
    backgroundColor: '#ffffff',
    borderBottomWidth: 3,
    borderBottomColor: '#ff9800',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  modalSummaryContainer: {
    padding: 24,
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 5,
    borderLeftColor: '#ff9800',
    position: 'relative',
    shadowColor: '#ff9800',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  modalSummaryRow: {
    position: 'relative',
    marginBottom: 0,
    paddingVertical: 18,
  },
  modalSummaryRowLast: {
    paddingBottom: 0,
  },
  modalSummaryRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  modalSummaryLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 180,
    marginRight: 20,
  },
  modalSummaryLabelIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#ff9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#ff6f00',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  modalSummaryLabelIconText: {
    fontSize: 18,
  },
  modalSummaryLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#495057',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    lineHeight: 18,
  },
  modalSummaryValueContainer: {
    flex: 1,
    position: 'relative',
    paddingLeft: 16,
    paddingRight: 8,
  },
  modalSummaryValue: {
    fontSize: 16,
    color: '#1a237e',
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.3,
    position: 'relative',
    zIndex: 2,
  },
  modalSummaryValueGlow: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#ff9800',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  modalSummaryRowLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#ff9800',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  modalErrors: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    borderLeftWidth: 5,
    borderLeftColor: '#ff9800',
    padding: 18,
    margin: 20,
    marginBottom: 24,
    borderRadius: 8,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalErrorIcon: {
    fontSize: 24,
    marginRight: 14,
    marginTop: 2,
  },
  modalErrorsList: {
    flex: 1,
  },
  modalErrorText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 6,
    lineHeight: 20,
    fontWeight: '500',
  },
  modalForm: {
    padding: 28,
    backgroundColor: '#ffffff',
  },
  modalFormField: {
    marginBottom: 28,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalFormLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#495057',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalFormLabelRequired: {
    color: '#d32f2f',
  },
  modalFormSubLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#495057',
    marginTop: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalFormInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: '#212529',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modalFormInputFocused: {
    borderColor: '#ff9800',
    backgroundColor: '#fffbf5',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  modalFormTextArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  modalRadioGroup: {
    marginTop: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
  },
  modalRadioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modalRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: '#1a237e',
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalRadioActive: {
    borderColor: '#ff9800',
  },
  modalRadioSelected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ff9800',
  },
  modalRadioOptionSelected: {
    backgroundColor: '#fffbf5',
    borderWidth: 1,
    borderColor: '#ff9800',
  },
  modalRadioLabel: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '500',
    flex: 1,
  },
  modalRadioLabelSelected: {
    color: '#1a237e',
    fontWeight: '700',
  },
  modalDateRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 20,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  modalDateField: {
    flex: 1,
    position: 'relative',
  },
  modalDateFieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalDateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#2196f3',
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  modalDateIconContainerUrgent: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
    shadowColor: '#ff9800',
  },
  modalDateIcon: {
    fontSize: 20,
  },
  // Icônes professionnelles stylisées
  iconDocument: {
    width: 16,
    height: 20,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ff9800',
    borderRadius: 1,
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 2,
  },
  iconGear: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    borderColor: '#ff9800',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    width: 16,
    height: 16,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: '#ff9800',
    borderRadius: 2,
    position: 'relative',
  },
  iconClock: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    borderColor: '#2196f3',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconClockUrgent: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    borderColor: '#ff9800',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCalendar: {
    width: 18,
    height: 16,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: '#2196f3',
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  // Détails des icônes
  iconDocumentFold: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 6,
    height: 6,
    backgroundColor: '#ff9800',
    borderTopLeftRadius: 1,
  },
  iconDocumentLines: {
    position: 'absolute',
    top: 6,
    left: 3,
    right: 3,
    height: 1.5,
    backgroundColor: '#ff9800',
    marginTop: 2,
  },
  iconGearCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff9800',
  },
  iconBoxTop: {
    position: 'absolute',
    top: -1,
    left: 2,
    width: 12,
    height: 4,
    backgroundColor: 'rgba(255, 152, 0, 0.3)',
    borderWidth: 1,
    borderColor: '#ff9800',
    borderRadius: 1,
  },
  iconClockHands: {
    position: 'absolute',
    width: 1.5,
    height: 6,
    backgroundColor: '#2196f3',
    top: 4,
    left: 8,
  },
  iconClockHandsUrgent: {
    position: 'absolute',
    width: 1.5,
    height: 6,
    backgroundColor: '#ff9800',
    top: 4,
    left: 8,
  },
  iconCalendarTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#2196f3',
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  iconCalendarGrid: {
    position: 'absolute',
    top: 6,
    left: 2,
    right: 2,
    bottom: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalDateLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#495057',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    flex: 1,
  },
  modalDateInputContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  modalDateInput: {
    borderWidth: 3,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    paddingLeft: 20,
    fontSize: 16,
    color: '#1a237e',
    backgroundColor: '#ffffff',
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  modalDateInputFocused: {
    borderColor: '#ff9800',
    backgroundColor: '#fffbf5',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  modalDateInputGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  modalDateInputGlowActive: {
    backgroundColor: 'rgba(255, 152, 0, 0.15)',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  modalDateHint: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
    paddingLeft: 4,
  },
  modalDateSeparator: {
    width: 2,
    backgroundColor: '#ff9800',
    marginTop: 40,
    marginHorizontal: 4,
    borderRadius: 1,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  modalMultiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  modalFormInputFlex: {
    flex: 1,
  },
  modalAddButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#ff9800',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  modalAddIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 24,
  },
  modalDeleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#dc3545',
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  modalDeleteIcon: {
    fontSize: 18,
    color: '#dc3545',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    paddingTop: 24,
    paddingBottom: 28,
    borderTopWidth: 2,
    borderTopColor: '#e9ecef',
    marginTop: 24,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 28,
    marginHorizontal: -28,
    marginBottom: -28,
  },
  modalCancelButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#dee2e6',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6c757d',
    letterSpacing: 0.5,
  },
  modalSaveButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#ff9800',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  // Styles pour le sélecteur de zones géographiques
  modalZoneSelectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#fff',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modalZoneSelectorButtonText: {
    fontSize: 15,
    color: '#212529',
    flex: 1,
  },
  modalZoneSelectorArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  modalSelectedZonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  modalSelectedZoneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbf5',
    borderWidth: 1,
    borderColor: '#ff9800',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  modalSelectedZoneText: {
    fontSize: 13,
    color: '#1a237e',
    fontWeight: '500',
    marginRight: 8,
  },
  modalSelectedZoneDelete: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ff9800',
  },
  modalSelectedZoneDeleteText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalZonePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalZonePickerContent: {
    width: '90%',
    maxWidth: 600,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 15,
    overflow: 'hidden',
  },
  modalZonePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 2,
    borderBottomColor: '#e9ecef',
  },
  modalZonePickerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a237e',
    flex: 1,
  },
  modalZonePickerClose: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalZonePickerCloseText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  modalZonePickerList: {
    maxHeight: 400,
  },
  modalZonePickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  modalZonePickerItemSelected: {
    backgroundColor: '#fffbf5',
  },
  modalZonePickerCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1a237e',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalZonePickerCheckboxSelected: {
    backgroundColor: '#ff9800',
    borderColor: '#ff9800',
  },
  modalZonePickerCheckmark: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalZonePickerItemText: {
    fontSize: 15,
    color: '#212529',
    flex: 1,
  },
  modalZonePickerItemTextSelected: {
    color: '#1a237e',
    fontWeight: '600',
  },
  modalZonePickerFooter: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 2,
    borderTopColor: '#e9ecef',
  },
  modalZonePickerDoneButton: {
    backgroundColor: '#ff9800',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  modalZonePickerDoneText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Styles pour Pièces Communes
  modalCommonPartsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalCommonPartsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCommonPartsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalCommonPartsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1a237e',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  modalCommonPartsSize: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  modalCommonPartsChevron: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCommonPartsChevronIcon: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  modalCommonPartsContent: {
    padding: 16,
    position: 'relative',
    minHeight: 120,
  },
  modalCommonPartsMessageContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalCommonPartsMessage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#495057',
    textAlign: 'center',
  },
  modalCommonPartsFilesList: {
    marginBottom: 16,
  },
  modalCommonPartsFileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalCommonPartsFileInfo: {
    flex: 1,
    marginRight: 12,
  },
  modalCommonPartsFileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 4,
  },
  modalCommonPartsFileSize: {
    fontSize: 12,
    color: '#666',
  },
  modalCommonPartsFileDelete: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  modalCommonPartsFileDeleteIcon: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '700',
  },
  modalCommonPartsActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  modalCommonPartsAddButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  modalCommonPartsAddIcon: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    lineHeight: 18,
  },
  modalCommonPartsValidateButton: {
    width: 36,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a237e',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  modalCommonPartsValidateIcon: {
    fontSize: 16,
    color: '#1a237e',
    fontWeight: '700',
    lineHeight: 16,
  },
  modalSaveButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 16,
    marginBottom: 8,
  },
  modalSaveButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1a237e',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalSaveButtonIconInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSaveButtonDiskIcon: {
    fontSize: 24,
    color: '#1a237e',
  },
  modalSaveButtonCount: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    fontSize: 10,
    color: '#1a237e',
    fontWeight: '700',
  },
});
