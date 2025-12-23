const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyApp API - OAuth2',
      version: '1.0.0',
      description: 'API d\'authentification avec OAuth2 Authorization Code Flow',
    },
    servers: [
      {
        url: 'http://localhost:8001',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key-change-in-production';
const PORT = process.env.PORT || 8001;

// Base de données SQLite
const db = new sqlite3.Database('./myapp.db');

// Initialiser les tables
db.serialize(() => {
  // Table users
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Table oauth2_clients
  db.run(`CREATE TABLE IF NOT EXISTS oauth2_clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT UNIQUE NOT NULL,
    client_secret TEXT NOT NULL,
    redirect_uri TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Table authorization_codes
  db.run(`CREATE TABLE IF NOT EXISTS authorization_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    client_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    redirect_uri TEXT,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Créer le client par défaut
  db.run(`INSERT OR IGNORE INTO oauth2_clients (client_id, client_secret, redirect_uri) 
    VALUES ('atline-services', '22360C1B138EA4EA935F1B28FB1B16CB', 'www.devatline.com')`);
});

// Fonctions utilitaires
function generateCode() {
  return require('crypto').randomBytes(32).toString('base64url');
}

function generateToken(user) {
  return jwt.sign({ sub: user.email, id: user.id }, JWT_SECRET, { expiresIn: '30m' });
}

// Routes

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Vérification de santé du serveur
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Serveur opérationnel
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@atline.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Email déjà enregistré ou données invalides
 */
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ detail: 'Email and password required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ detail: 'Email already registered' });
      }
      return res.status(500).json({ detail: err.message });
    }
    res.status(201).json({ id: this.lastID, email, is_active: true });
  });
});

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Connexion et obtention d'un Bearer token
 *     description: Authentifie un utilisateur et retourne un JWT Bearer token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *                 description: Nom d'utilisateur (peut être un username simple ou un email)
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: Mot de passe de l'utilisateur
 *     responses:
 *       200:
 *         description: Token généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 token_type:
 *                   type: string
 *                   example: bearer
 *       401:
 *         description: Email ou mot de passe incorrect
 */
app.post('/auth/token', async (req, res) => {
  const { username, email, password } = req.body;
  // Accepter soit 'username' soit 'email' pour la compatibilité
  const userEmail = email || username;
  
  if (!userEmail || !password) {
    return res.status(400).json({ detail: 'Email/username and password required' });
  }

  // Si c'est un username (sans @), chercher dans la partie avant @ de l'email
  let query = 'SELECT * FROM users WHERE email = ?';
  let queryParam = userEmail;
  
  // Si l'input ne contient pas @, chercher par username (partie avant @ de l'email)
  if (!userEmail.includes('@')) {
    query = 'SELECT * FROM users WHERE substr(email, 1, instr(email, "@") - 1) = ?';
    queryParam = userEmail;
  }
  
  db.get(query, [queryParam], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }

    const token = generateToken(user);
    res.json({ access_token: token, token_type: 'bearer' });
  });
});

/**
 * @swagger
 * /oauth2/authorize-json:
 *   get:
 *     summary: Obtention d'un code d'autorisation OAuth2 (JSON)
 *     description: Génère un code d'autorisation pour le flow OAuth2. Retourne le code en JSON au lieu de rediriger.
 *     tags: [OAuth2]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: response_type
 *         required: true
 *         schema:
 *           type: string
 *           example: code
 *       - in: query
 *         name: client_id
 *         required: true
 *         schema:
 *           type: string
 *           example: atline-services
 *       - in: query
 *         name: redirect_uri
 *         required: true
 *         schema:
 *           type: string
 *           example: www.devatline.com
 *       - in: query
 *         name: state
 *         required: false
 *         schema:
 *           type: string
 *           example: abc
 *     responses:
 *       200:
 *         description: Code d'autorisation généré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: azdaaaaaaaaaaaaaaaaa9b49a83047
 *                 state:
 *                   type: string
 *                   example: abc
 *       401:
 *         description: Token Bearer invalide ou manquant
 *       400:
 *         description: Paramètres invalides
 */
app.get('/oauth2/authorize-json', (req, res) => {
  const { response_type, client_id, redirect_uri, state } = req.query;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Bearer token required' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.sub;

    if (response_type !== 'code') {
      return res.status(400).json({ detail: "response_type must be 'code'" });
    }

    // Vérifier le client
    db.get('SELECT * FROM oauth2_clients WHERE client_id = ? AND is_active = 1', [client_id], (err, client) => {
      if (err || !client) {
        return res.status(401).json({ detail: 'Invalid client_id' });
      }

      if (client.redirect_uri && client.redirect_uri !== redirect_uri) {
        return res.status(400).json({ detail: 'Invalid redirect_uri' });
      }

      // Récupérer l'utilisateur
      db.get('SELECT * FROM users WHERE email = ?', [userEmail], (err, user) => {
        if (err || !user) {
          return res.status(401).json({ detail: 'User not found' });
        }

        // Générer le code
        const code = generateCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        db.run(
          'INSERT INTO authorization_codes (code, client_id, user_id, redirect_uri, expires_at) VALUES (?, ?, ?, ?, ?)',
          [code, client_id, user.id, redirect_uri, expiresAt.toISOString()],
          (err) => {
            if (err) {
              return res.status(500).json({ detail: err.message });
            }

            const response = { code };
            if (state) response.state = state;
            res.json(response);
          }
        );
      });
    });
  } catch (err) {
    return res.status(401).json({ detail: 'Invalid token' });
  }
});

/**
 * @swagger
 * /oauth2/token:
 *   post:
 *     summary: Échange d'un code d'autorisation contre un access_token
 *     description: Échange le code obtenu depuis /oauth2/authorize-json contre un access_token JWT
 *     tags: [OAuth2]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grant_type
 *               - client_id
 *               - client_secret
 *               - code
 *             properties:
 *               grant_type:
 *                 type: string
 *                 example: authorization_code
 *               client_id:
 *                 type: string
 *                 example: atline-services
 *               client_secret:
 *                 type: string
 *                 example: 22360C1B138EA4EA935F1B28FB1B16CB
 *               code:
 *                 type: string
 *                 example: azdaaaaaaaaaaaaaaaaa9b49a83047
 *                 description: Code obtenu depuis /oauth2/authorize-json
 *               redirect_uri:
 *                 type: string
 *                 example: www.devatline.com
 *     responses:
 *       200:
 *         description: Access token généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 token_type:
 *                   type: string
 *                   example: bearer
 *                 expires_in:
 *                   type: integer
 *                   example: 1800
 *       400:
 *         description: Code invalide, expiré ou déjà utilisé
 *       401:
 *         description: Client ID ou secret invalide
 */
app.post('/oauth2/token', (req, res) => {
  const { grant_type, client_id, client_secret, code, redirect_uri } = req.body;

  if (grant_type !== 'authorization_code') {
    return res.status(400).json({ detail: "grant_type must be 'authorization_code'" });
  }

  if (!code) {
    return res.status(400).json({ detail: 'code parameter is required' });
  }

  // Vérifier le client
  db.get('SELECT * FROM oauth2_clients WHERE client_id = ? AND is_active = 1', [client_id], (err, client) => {
    if (err || !client) {
      return res.status(401).json({ detail: 'Invalid client_id' });
    }

    if (client.client_secret !== client_secret) {
      return res.status(401).json({ detail: 'Invalid client_secret' });
    }

    // Vérifier le code
    db.get('SELECT * FROM authorization_codes WHERE code = ?', [code], (err, authCode) => {
      if (err || !authCode) {
        return res.status(400).json({ detail: 'Invalid authorization code' });
      }

      if (authCode.used === 1) {
        return res.status(400).json({ detail: 'Authorization code already used' });
      }

      if (new Date(authCode.expires_at) < new Date()) {
        return res.status(400).json({ detail: 'Authorization code expired' });
      }

      if (authCode.client_id !== client_id) {
        return res.status(400).json({ detail: 'Code does not match client_id' });
      }

      if (redirect_uri && authCode.redirect_uri !== redirect_uri) {
        return res.status(400).json({ detail: 'redirect_uri mismatch' });
      }

      // Récupérer l'utilisateur
      db.get('SELECT * FROM users WHERE id = ?', [authCode.user_id], (err, user) => {
        if (err || !user || !user.is_active) {
          return res.status(400).json({ detail: 'User not found or inactive' });
        }

        // Marquer le code comme utilisé
        db.run('UPDATE authorization_codes SET used = 1 WHERE code = ?', [code]);

        // Générer le token
        const accessToken = generateToken(user);
        res.json({
          access_token: accessToken,
          token_type: 'bearer',
          expires_in: 1800 // 30 minutes en secondes
        });
      });
    });
  });
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     description: Retourne les informations de l'utilisateur authentifié via le Bearer token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 is_active:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Token invalide ou manquant
 */
app.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Bearer token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.get('SELECT id, email, is_active FROM users WHERE email = ?', [decoded.sub], (err, user) => {
      if (err || !user) {
        return res.status(401).json({ detail: 'User not found' });
      }
      res.json(user);
    });
  } catch (err) {
    return res.status(401).json({ detail: 'Invalid token' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur http://0.0.0.0:${PORT}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/docs`);
  console.log(`✅ Prêt à recevoir des requêtes!`);
  console.log(`📱 Accessible depuis l'émulateur Android via http://10.0.2.2:${PORT}`);
});

