// Créer un utilisateur pour ghitabr
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./myapp.db');

async function createUser() {
  // Créer avec email ghitabr@example.com pour que ça fonctionne avec le username "ghitabr"
  const email = 'ghitabr@example.com';
  const password = 'ghitaesisa123.';
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT OR REPLACE INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
    if (err) {
      console.error('Erreur:', err.message);
    } else {
      console.log('✅ Utilisateur créé!');
      console.log('');
      console.log('Pour te connecter, utilise:');
      console.log('   username: ghitabr');
      console.log('   password: ghitaesisa123.');
      console.log('');
      console.log('OU');
      console.log('   username: ghitabr@example.com');
      console.log('   password: ghitaesisa123.');
    }
    db.close();
  });
}

createUser();







