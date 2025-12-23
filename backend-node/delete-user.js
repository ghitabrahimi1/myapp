// Script pour supprimer un utilisateur de la base de données
const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');

const db = new sqlite3.Database('./myapp.db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🗑️  SUPPRESSION D\'UN UTILISATEUR\n');

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
  
  rl.question('ID de l\'utilisateur à supprimer (ou "annuler" pour annuler): ', (answer) => {
    if (answer.toLowerCase() === 'annuler' || answer.toLowerCase() === 'cancel') {
      console.log('❌ Opération annulée');
      rl.close();
      db.close();
      return;
    }
    
    const userId = parseInt(answer);
    if (isNaN(userId)) {
      console.error('❌ ID invalide');
      rl.close();
      db.close();
      return;
    }
    
    // Vérifier que l'utilisateur existe
    db.get('SELECT email FROM users WHERE id = ?', [userId], (err, user) => {
      if (err || !user) {
        console.error('❌ Utilisateur non trouvé');
        rl.close();
        db.close();
        return;
      }
      
      rl.question(`⚠️  Êtes-vous sûr de vouloir supprimer ${user.email}? (oui/non): `, (confirm) => {
        if (confirm.toLowerCase() !== 'oui' && confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'o') {
          console.log('❌ Opération annulée');
          rl.close();
          db.close();
          return;
        }
        
        db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
          if (err) {
            console.error('❌ Erreur lors de la suppression:', err.message);
          } else {
            console.log(`✅ Utilisateur ${user.email} supprimé avec succès`);
          }
          
          rl.close();
          db.close();
        });
      });
    });
  });
});







