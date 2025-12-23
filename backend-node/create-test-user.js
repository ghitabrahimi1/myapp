// Script pour créer un utilisateur de test
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./myapp.db');

async function createTestUser() {
  const email = 'test@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT OR REPLACE INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
    if (err) {
      console.error('Erreur:', err.message);
    } else {
      console.log('✅ Utilisateur de test créé:');
      console.log('   Email: test@example.com');
      console.log('   Password: password123');
      console.log('');
      console.log('Tu peux maintenant tester le login avec:');
      console.log('   username: test@example.com');
      console.log('   password: password123');
    }
    db.close();
  });
}

createTestUser();







