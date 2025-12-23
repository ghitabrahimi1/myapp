// Script pour visualiser les utilisateurs avec leurs mots de passe hashés
// ⚠️ ATTENTION: Les mots de passe sont hashés et ne peuvent pas être décryptés
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./myapp.db');

console.log('🔐 UTILISATEURS AVEC MOTS DE PASSE HASHÉS\n');
console.log('⚠️  Les mots de passe sont hashés avec bcrypt et ne peuvent pas être décryptés');
console.log('💡 Pour réinitialiser un mot de passe, utilisez: node reset-password.js\n');
console.log('='.repeat(70));

// Afficher tous les utilisateurs avec leurs mots de passe hashés
db.all('SELECT id, email, password, is_active, created_at FROM users ORDER BY id', (err, users) => {
  if (err) {
    console.error('❌ Erreur:', err.message);
    db.close();
    return;
  }
  
  if (users.length === 0) {
    console.log('\nAucun utilisateur dans la base de données');
    db.close();
    return;
  }
  
  console.log(`\n👥 UTILISATEURS (${users.length}):\n`);
  users.forEach((user, index) => {
    console.log(`${index + 1}. ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Mot de passe hashé: ${user.password.substring(0, 30)}...`);
    console.log(`   Longueur du hash: ${user.password.length} caractères`);
    console.log(`   Actif: ${user.is_active ? 'Oui' : 'Non'}`);
    console.log(`   Créé le: ${user.created_at || 'N/A'}`);
    console.log('');
  });
  
  console.log('='.repeat(70));
  console.log('\n💡 Pour réinitialiser un mot de passe:');
  console.log('   node reset-password.js');
  console.log('\n💡 Pour voir seulement les utilisateurs (sans mots de passe):');
  console.log('   node view-db.js\n');
  
  db.close();
});







