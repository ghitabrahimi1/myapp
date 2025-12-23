// Script pour réinitialiser le mot de passe d'un utilisateur
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const readline = require('readline');

const db = new sqlite3.Database('./myapp.db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔑 RÉINITIALISATION DU MOT DE PASSE\n');

// Afficher tous les utilisateurs
db.all('SELECT id, email FROM users ORDER BY id', (err, users) => {
  if (err) {
    console.error('Erreur:', err.message);
    rl.close();
    db.close();
    return;
  }
  
  if (users.length === 0) {
    console.log('Aucun utilisateur dans la base de données');
    rl.close();
    db.close();
    return;
  }
  
  console.log('Utilisateurs disponibles:');
  users.forEach(user => {
    console.log(`  ${user.id}. ${user.email}`);
  });
  console.log('');
  
  rl.question('ID de l\'utilisateur (ou "annuler" pour annuler): ', (userIdInput) => {
    if (userIdInput.toLowerCase() === 'annuler' || userIdInput.toLowerCase() === 'cancel') {
      console.log('❌ Opération annulée');
      rl.close();
      db.close();
      return;
    }
    
    const userId = parseInt(userIdInput);
    if (isNaN(userId)) {
      console.error('❌ ID invalide');
      rl.close();
      db.close();
      return;
    }
    
    // Vérifier que l'utilisateur existe
    db.get('SELECT email FROM users WHERE id = ?', [userId], async (err, user) => {
      if (err || !user) {
        console.error('❌ Utilisateur non trouvé');
        rl.close();
        db.close();
        return;
      }
      
      rl.question(`Nouveau mot de passe pour ${user.email}: `, async (newPassword) => {
        if (!newPassword || newPassword.length < 6) {
          console.error('❌ Mot de passe trop court (minimum 6 caractères)');
          rl.close();
          db.close();
          return;
        }
        
        try {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          
          db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], function(err) {
            if (err) {
              console.error('❌ Erreur lors de la mise à jour:', err.message);
            } else {
              console.log(`\n✅ Mot de passe mis à jour pour ${user.email}`);
              console.log(`   Nouveau mot de passe: ${newPassword}`);
            }
            
            rl.close();
            db.close();
          });
        } catch (error) {
          console.error('❌ Erreur lors du hashage:', error.message);
          rl.close();
          db.close();
        }
      });
    });
  });
});







