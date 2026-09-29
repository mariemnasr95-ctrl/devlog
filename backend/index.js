const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'votre_cle_secrete_jwt';

// Allow frontend requests and parse incoming JSON API bodies.
app.use(cors());
app.use(express.json());

// Bases de données temporaires (en mémoire)
const users = [];
const blogs = [];

// Middleware d'authentification pour sécuriser les routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Accès refusé. Jeton manquant.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Jeton invalide ou expiré.' });
    req.user = user;
    next();
  });
};

// ==========================================
// 1. API: Inscription (User Registration)
// ==========================================
// Frontend signup request: POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), username, email, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: 'Utilisateur créé avec succès !' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l’inscription.' });
  }
});

// ==========================================
// 2. API: Connexion (User Login)
// ==========================================
// Frontend login request: POST /api/login; success returns a JWT.
app.post('/api/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const loginIdentifier = username || email;
    const user = users.find(u => u.username === loginIdentifier || u.email === loginIdentifier);
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: 'Connexion réussie !' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
});

// ==========================================
// 3. API: Créer un blog (Create Blog)
// ==========================================
// Protected frontend request: POST /api/blogs requires the login JWT.
app.post('/api/blogs', authenticateToken, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Le titre et le contenu sont requis.' });
  }

  const newBlog = {
    id: Date.now(),
    title,
    content,
    authorId: req.user.id,
    createdAt: new Date()
  };

  blogs.push(newBlog);
  res.status(201).json({ message: 'Blog créé avec succès !', blog: newBlog });
});

// Home feed request: GET /api/blogs returns published blogs.
app.get('/api/blogs', (req, res) => {
  res.json(blogs);
});
app.get('/', (req, res) => {
  res.send('Serveur backend opérationnel !');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});