// Script pour créer un utilisateur dans la base de données
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const readline = require('readline');

const db = new sqlite3.Database('./myapp.db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('👤 CRÉATION D\'UN NOUVEL UTILISATEUR\n');

rl.question('Nom d\'utilisateur (ex: nom_utilisateur) ou email complet (nom@atline.com): ', (emailInput) => {
  if (!emailInput) {
    console.error('❌ Nom d\'utilisateur ou email requis');
    rl.close();
    db.close();
    return;
  }
  
  let email = emailInput;
  
  // Si l'utilisateur n'a pas entré @atline.com, l'ajouter automatiquement
  if (!email.includes('@')) {
    email = email + '@atline.com';
    console.log(`📧 Email complet: ${email}`);
  } else if (!email.includes('@atline.com')) {
    console.error('❌ Le domaine doit être @atline.com');
    rl.close();
    db.close();
    return;
  }
  
  rl.question('Mot de passe: ', async (password) => {
    if (!password || password.length < 6) {
      console.error('❌ Mot de passe trop court (minimum 6 caractères)');
      rl.close();
      db.close();
      return;
    }
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            console.error('❌ Cet email est déjà enregistré');
          } else {
            console.error('❌ Erreur:', err.message);
          }
        } else {
          console.log('\n✅ Utilisateur créé avec succès!');
          console.log(`   ID: ${this.lastID}`);
          console.log(`   Email: ${email}`);
          console.log(`\n💡 Pour vous connecter, utilisez:`);
          console.log(`   Username: ${email.split('@')[0]} ou ${email}`);
          console.log(`   Password: ${password}`);
        }
        
        rl.close();
        db.close();
      });
    } catch (error) {
      console.error('❌ Erreur lors du hashage du mot de passe:', error.message);
      rl.close();
      db.close();
    }
  });
});

