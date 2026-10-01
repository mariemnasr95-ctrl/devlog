const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Blog = require('./models/Blog');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY';

const memoryUsers = [];
const memoryBlogs = [];

app.use(express.json());
app.use(cors());

const isMongoReady = () => !!process.env.MONGO_URI && mongoose.connection.readyState === 1;

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connecté avec succès à MongoDB Atlas !'))
    .catch((err) => console.error('❌ Erreur de connexion :', err));
} else {
  console.warn('⚠️ No MONGO_URI configured. Using in-memory storage for auth/blog data.');
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Accès refusé. Jeton manquant.' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Jeton invalide ou expiré.' });
    req.user = decoded;
    next();
  });
};

const createToken = (user) => jwt.sign({
  id: user._id || user.id,
  username: user.username || user.email,
  email: user.email
}, JWT_SECRET, { expiresIn: '1h' });

const normalizeRegisterInput = (body = {}) => {
  const username = body.username || (body.email ? body.email.split('@')[0] : 'user');
  const email = body.email || `${username}@example.com`;
  return { username, email, password: body.password };
};

const normalizeLoginInput = (body = {}) => ({
  identifier: body.username || body.email,
  password: body.password
});

// ==========================================
// 1. ROUTES AUTHENTIFICATION
// ==========================================

app.post(['/api/register', '/api/auth/register'], async (req, res) => {
  try {
    const { username, email, password } = normalizeRegisterInput(req.body);

    if (!password) return res.status(400).json({ message: 'Le mot de passe est requis.' });

    if (isMongoReady()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Cet email est déjà utilisé.' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      return res.status(201).json({ message: 'Utilisateur créé avec succès !' });
    }

    const existingLocalUser = memoryUsers.find((user) => user.email === email || user.username === username);
    if (existingLocalUser) return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    memoryUsers.push({ id: Date.now(), username, email, password: hashedPassword });
    res.status(201).json({ message: 'Utilisateur créé avec succès !' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post(['/api/login', '/api/auth/login'], async (req, res) => {
  try {
    const { identifier, password } = normalizeLoginInput(req.body);

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Nom d’utilisateur et mot de passe requis.' });
    }

    if (isMongoReady()) {
      const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
      if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect.' });

      const token = createToken(user);
      return res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    }

    const user = memoryUsers.find((entry) => entry.username === identifier || entry.email === identifier);
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect.' });

    const token = createToken(user);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 2. ROUTES BLOGS (CRUD)
// ==========================================

app.post(['/api/blogs', '/api/auth/blogs'], authenticateToken, async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Le titre et le contenu sont requis.' });
    }

    const blogAuthor = author || req.user?.username || req.user?.email || 'anonymous';

    if (isMongoReady()) {
      const newBlog = new Blog({ title, content, author: blogAuthor });
      const savedBlog = await newBlog.save();
      return res.status(201).json(savedBlog);
    }

    const newBlog = {
      id: Date.now(),
      title,
      content,
      author: blogAuthor,
      createdAt: new Date().toISOString()
    };
    memoryBlogs.push(newBlog);
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get(['/api/blogs', '/api/auth/blogs'], async (req, res) => {
  try {
    if (isMongoReady()) {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      return res.json(blogs);
    }

    res.json(memoryBlogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    if (isMongoReady()) {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Article non trouvé.' });
      return res.json(blog);
    }

    const blog = memoryBlogs.find((entry) => entry.id === Number(req.params.id));
    if (!blog) return res.status(404).json({ message: 'Article non trouvé.' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));