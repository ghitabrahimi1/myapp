import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import SimplePicker from '../components/SimplePicker';

interface RegisterScreenProps {
  onBack: () => void;
  onRegister: () => void;
}

export default function RegisterScreen({ onBack, onRegister }: RegisterScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [siret, setSiret] = useState('');
  const [siretType, setSiretType] = useState('Siret');
  const [companyName, setCompanyName] = useState('');
  const [legalForm, setLegalForm] = useState('');
  const [workforce, setWorkforce] = useState('');
  const [turnover, setTurnover] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('FRANCE');
  const [phone, setPhone] = useState('');
  const [fax, setFax] = useState('');
  const [website, setWebsite] = useState('');
  const [nafCode, setNafCode] = useState('');
  const [title, setTitle] = useState('Monsieur');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [functionRole, setFunctionRole] = useState('');
  const [timezone, setTimezone] = useState('Europe/Paris');
  const [acceptContact, setAcceptContact] = useState(false);

  const handleRegister = () => {
    if (!identifier || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    if (!email || email !== confirmEmail) {
      Alert.alert('Erreur', 'Les emails ne correspondent pas');
      return;
    }
    Alert.alert('Succès', 'Inscription réussie !');
    onRegister();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FORMULAIRE D'INSCRIPTION</Text>
        <Text style={styles.headerSubtitle}>AU SITE MARCHES-SECURISES.FR</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Section 1: Identifiant et mot de passe */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Votre identifiant et votre mot de passe</Text>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>* Identifiant</Text>
            <TextInput
              style={styles.input}
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>* Mot de passe</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>* Confirmation du mot de passe</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>

        {/* Section 2: Coordonnées de la société */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Les coordonnées de votre société</Text>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>SIRET</Text>
            <View style={styles.row}>
              <SimplePicker
                selectedValue={siretType}
                onValueChange={setSiretType}
                items={[
                  { label: 'Siret', value: 'Siret' },
                  { label: 'RCA', value: 'RCA' },
                  { label: 'TVA Intracom', value: 'TVA Intracom' },
                  { label: 'TAHITI', value: 'TAHITI' },
                  { label: 'RIDET', value: 'RIDET' },
                  { label: 'FRWF', value: 'FRWF' },
                  { label: 'IREP', value: 'IREP' },
                  { label: 'Autre', value: 'Autre' },
                  { label: 'Hors-UE', value: 'Hors-UE' },
                  { label: 'RNA', value: 'RNA' },
                ]}
                style={styles.siretPicker}
              />
              <TextInput
                style={[styles.input, styles.siretInput]}
                value={siret}
                onChangeText={setSiret}
                placeholder="14 chiffres"
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.hint}>14 chiffres, sans espaces ou caractères spéciaux</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.searchButtonText}>RECHERCHER</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clearButton}>
                <Text style={styles.clearButtonText}>EFFACER LE FORMULAIRE</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>* Nom de votre société</Text>
            <TextInput
              style={styles.input}
              value={companyName}
              onChangeText={setCompanyName}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <Text style={styles.label}>Forme juridique</Text>
              <SimplePicker
                selectedValue={legalForm}
                onValueChange={setLegalForm}
                items={[
                  { label: '-- Sélectionnez --', value: '' },
                  { label: 'SARL', value: 'SARL' },
                  { label: 'SA', value: 'SA' },
                  { label: 'SAS', value: 'SAS' },
                  { label: 'EURL', value: 'EURL' },
                ]}
                placeholder="-- Sélectionnez --"
              />
            </View>

            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <Text style={styles.label}>Effectif</Text>
              <SimplePicker
                selectedValue={workforce}
                onValueChange={setWorkforce}
                items={[
                  { label: '-- Sélectionnez --', value: '' },
                  { label: '0-9', value: '0-9' },
                  { label: '10-49', value: '10-49' },
                  { label: '50-249', value: '50-249' },
                ]}
                placeholder="-- Sélectionnez --"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Chiffre d'affaire</Text>
            <SimplePicker
              selectedValue={turnover}
              onValueChange={setTurnover}
              items={[
                { label: '-- Sélectionnez --', value: '' },
                { label: '< 2M€', value: '<2M' },
                { label: '2M€ - 10M€', value: '2M-10M' },
                { label: '> 10M€', value: '>10M' },
              ]}
              placeholder="-- Sélectionnez --"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>* Adresse</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Adresse (suite)</Text>
            <TextInput
              style={styles.input}
              value={address2}
              onChangeText={setAddress2}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <Text style={styles.label}>* Code postal</Text>
              <TextInput
                style={styles.input}
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <Text style={styles.label}>* Commune</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Pays</Text>
            <SimplePicker
              selectedValue={country}
              onValueChange={setCountry}
              items={[
                { label: 'FRANCE', value: 'FRANCE' },
                { label: 'BELGIQUE', value: 'BELGIQUE' },
                { label: 'SUISSE', value: 'SUISSE' },
              ]}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <Text style={styles.label}>Fax</Text>
              <TextInput
                style={styles.input}
                value={fax}
                onChangeText={setFax}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Site Web</Text>
            <TextInput
              style={styles.input}
              value={website}
              onChangeText={setWebsite}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Code Naf</Text>
            <TextInput
              style={styles.input}
              value={nafCode}
              onChangeText={setNafCode}
            />
            <Text style={styles.hint}>Aidez-vous du champ de recherche 'Recherchez votre code Naf'</Text>
            <Text style={styles.label}>Recherchez votre code Naf :</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              placeholder="Retrouvez votre code NAF en indiquant un mot clé ci-dessus"
            />
          </View>
        </View>

        {/* Section 3: Informations supplémentaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations supplémentaires</Text>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Vos activités annexes (si applicables)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              placeholder="Retrouvez vos domaines d'activité en indiquant un mot clé ci-dessus"
            />
            <View style={styles.row}>
              <View style={[styles.inputWrapper, styles.halfWidth]}>
                <Text style={styles.label}>Activité annexe 1:</Text>
                <TextInput style={styles.input} />
              </View>
              <View style={[styles.inputWrapper, styles.halfWidth]}>
                <Text style={styles.label}>Activité annexe 2:</Text>
                <TextInput style={styles.input} />
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Activité annexe 3:</Text>
              <TextInput style={styles.input} />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Zone d'intervention</Text>
            <SimplePicker
              selectedValue=""
              onValueChange={() => {}}
              items={[
                { label: '-- Sélectionnez --', value: '' },
                { label: 'National', value: 'national' },
                { label: 'Régional', value: 'regional' },
                { label: 'Départemental', value: 'departemental' },
              ]}
              placeholder="-- Sélectionnez --"
            />
          </View>
        </View>

        {/* Section 4: Coordonnées */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coordonnées</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <Text style={styles.label}>* Civilité</Text>
              <SimplePicker
                selectedValue={title}
                onValueChange={setTitle}
                items={[
                  { label: 'Monsieur', value: 'Monsieur' },
                  { label: 'Madame', value: 'Madame' },
                  { label: 'Mademoiselle', value: 'Mademoiselle' },
                ]}
              />
            </View>

            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>* Nom</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <Text style={styles.label}>* Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <Text style={styles.label}>* Confirmation d'Email</Text>
              <TextInput
                style={styles.input}
                value={confirmEmail}
                onChangeText={setConfirmEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Fonction</Text>
            <SimplePicker
              selectedValue={functionRole}
              onValueChange={setFunctionRole}
              items={[
                { label: '--- Sélectionnez une fonction ---', value: '' },
                { label: 'Directeur', value: 'directeur' },
                { label: 'Responsable', value: 'responsable' },
                { label: 'Chef de projet', value: 'chef_projet' },
              ]}
              placeholder="--- Sélectionnez une fonction ---"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={[styles.inputWrapper, styles.halfWidth]}>
              <Text style={styles.label}>Fax</Text>
              <TextInput
                style={styles.input}
                value={fax}
                onChangeText={setFax}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Fuseau horaire</Text>
            <SimplePicker
              selectedValue={timezone}
              onValueChange={setTimezone}
              items={[
                { label: 'Europe/Paris', value: 'Europe/Paris' },
                { label: 'Europe/London', value: 'Europe/London' },
                { label: 'Europe/Berlin', value: 'Europe/Berlin' },
              ]}
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAcceptContact(!acceptContact)}
          >
            <View style={[styles.checkbox, acceptContact && styles.checkboxChecked]}>
              {acceptContact && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              J'accepte que mes coordonnées puissent permettre à des acheteurs de me contacter
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bouton VALIDER */}
        <TouchableOpacity style={styles.validateButton} onPress={handleRegister}>
          <Text style={styles.validateButtonText}>VALIDER</Text>
        </TouchableOpacity>

        <View style={styles.hotline}>
          <Text style={styles.hotlineText}>Hotline : 04 92 90 93 27</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a237e',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1a237e',
    paddingBottom: 10,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  siretPicker: {
    width: 140,
    minWidth: 140,
  },
  siretInput: {
    flex: 1,
    marginLeft: 10,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  searchButton: {
    backgroundColor: '#1a237e',
    padding: 10,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  clearButton: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#1a237e',
    borderRadius: 4,
    marginRight: 10,
    marginTop: 2,
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
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  validateButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  validateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hotline: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  hotlineText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: '600',
  },
});

