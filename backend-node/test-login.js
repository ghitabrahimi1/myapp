// Script de test pour vérifier le login
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./myapp.db');

async function testLogin() {
  const username = 'john_doe';
  const password = 'password123';
  
  console.log(`\n🔍 Test de login avec username: "${username}"`);
  
  // Test de la requête SQL
  const query = 'SELECT * FROM users WHERE substr(email, 1, instr(email, "@") - 1) = ?';
  
  db.get(query, [username], async (err, user) => {
    if (err) {
      console.error('❌ Erreur SQL:', err.message);
      db.close();
      return;
    }
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé avec la requête substr');
      console.log('   Requête:', query);
      console.log('   Paramètre:', username);
      
      // Vérifier tous les utilisateurs
      db.all('SELECT email FROM users', (err, rows) => {
        if (!err) {
          console.log('\n📋 Utilisateurs dans la base:');
          rows.forEach(r => {
            const userPart = r.email.split('@')[0];
            console.log(`   - ${r.email} (username: ${userPart})`);
          });
        }
        db.close();
      });
      return;
    }
    
    console.log('✅ Utilisateur trouvé:', user.email);
    
    // Tester le mot de passe
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      console.log('✅ Mot de passe correct!');
      console.log('✅ Login devrait fonctionner!');
    } else {
      console.log('❌ Mot de passe incorrect');
    }
    
    db.close();
  });
}

testLogin();







