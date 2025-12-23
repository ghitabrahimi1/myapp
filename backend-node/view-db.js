// Script pour visualiser le contenu de la base de données
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./myapp.db');

console.log('📊 CONTENU DE LA BASE DE DONNÉES\n');
console.log('='.repeat(50));

// Afficher tous les utilisateurs
db.all('SELECT id, email, is_active, created_at FROM users ORDER BY id', (err, users) => {
  if (err) {
    console.error('Erreur:', err.message);
    db.close();
    return;
  }
  
  console.log('\n👥 UTILISATEURS (' + users.length + '):');
  console.log('-'.repeat(50));
  users.forEach(user => {
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Actif: ${user.is_active ? 'Oui' : 'Non'}`);
    console.log(`  Créé le: ${user.created_at || 'N/A'}`);
    console.log('');
  });
  
  // Afficher les clients OAuth2
  db.all('SELECT id, client_id, redirect_uri, is_active FROM oauth2_clients', (err, clients) => {
    if (err) {
      console.error('Erreur:', err.message);
      db.close();
      return;
    }
    
    console.log('🔐 CLIENTS OAUTH2 (' + clients.length + '):');
    console.log('-'.repeat(50));
    clients.forEach(client => {
      console.log(`  ID: ${client.id}`);
      console.log(`  Client ID: ${client.client_id}`);
      console.log(`  Redirect URI: ${client.redirect_uri || 'N/A'}`);
      console.log(`  Actif: ${client.is_active ? 'Oui' : 'Non'}`);
      console.log('');
    });
    
    // Afficher les codes d'autorisation
    db.all(`SELECT ac.id, ac.code, ac.client_id, u.email as user_email, 
            ac.expires_at, ac.used, ac.created_at 
            FROM authorization_codes ac
            LEFT JOIN users u ON ac.user_id = u.id
            ORDER BY ac.created_at DESC
            LIMIT 10`, (err, codes) => {
      if (err) {
        console.error('Erreur:', err.message);
        db.close();
        return;
      }
      
      console.log('🔑 CODES D\'AUTORISATION (10 derniers):');
      console.log('-'.repeat(50));
      if (codes.length === 0) {
        console.log('  Aucun code d\'autorisation');
      } else {
        codes.forEach(code => {
          console.log(`  Code: ${code.code.substring(0, 20)}...`);
          console.log(`  Client: ${code.client_id}`);
          console.log(`  Utilisateur: ${code.user_email || 'N/A'}`);
          console.log(`  Expire le: ${code.expires_at}`);
          console.log(`  Utilisé: ${code.used ? 'Oui' : 'Non'}`);
          console.log(`  Créé le: ${code.created_at}`);
          console.log('');
        });
      }
      
      console.log('='.repeat(50));
      db.close();
    });
  });
});







