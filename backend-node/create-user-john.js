// Créer un utilisateur pour john_doe
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./myapp.db');

async function createUser() {
  // Créer avec email john_doe@example.com pour que ça fonctionne
  const email = 'john_doe@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT OR REPLACE INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
    if (err) {
      console.error('Erreur:', err.message);
    } else {
      console.log('✅ Utilisateur créé!');
      console.log('');
      console.log('Pour te connecter, utilise:');
      console.log('   username: john_doe@example.com');
      console.log('   password: password123');
      console.log('');
      console.log('OU si tu veux vraiment utiliser "john_doe", modifie le code pour chercher aussi par username.');
    }
    db.close();
  });
}

createUser();







