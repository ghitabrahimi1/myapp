// Script pour créer un utilisateur avec paramètres en ligne de commande
// Usage: node create-user-simple.js nom_utilisateur password123
// Le domaine @atline.com sera ajouté automatiquement

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

let email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('❌ Usage: node create-user-simple.js nom_utilisateur password123');
  console.error('   Exemple: node create-user-simple.js test password123');
  console.error('   Ou: node create-user-simple.js test@atline.com password123');
  process.exit(1);
}

// Si l'utilisateur n'a pas entré @atline.com, l'ajouter automatiquement
if (!email.includes('@')) {
  email = email + '@atline.com';
  console.log(`📧 Email complet: ${email}`);
} else if (!email.includes('@atline.com')) {
  console.error('❌ Le domaine doit être @atline.com');
  process.exit(1);
}

if (password.length < 6) {
  console.error('❌ Mot de passe trop court (minimum 6 caractères)');
  process.exit(1);
}

const db = new sqlite3.Database('./myapp.db');

async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          console.error('❌ Cet email est déjà enregistré');
        } else {
          console.error('❌ Erreur:', err.message);
        }
        db.close();
        process.exit(1);
      } else {
        console.log('\n✅ Utilisateur créé avec succès!');
        console.log(`   ID: ${this.lastID}`);
        console.log(`   Email: ${email}`);
        console.log(`\n💡 Pour vous connecter, utilisez:`);
        console.log(`   Username: ${email.split('@')[0]} ou ${email}`);
        console.log(`   Password: ${password}`);
        console.log(`\n📧 Email créé: ${email}`);
        db.close();
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors du hashage du mot de passe:', error.message);
    db.close();
    process.exit(1);
  }
}

createUser();

