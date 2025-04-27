// app.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port = 3000;

// Set up file upload storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'pear-paradise-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// User database (in-memory for simplicity)
const users = [
  { id: 1, username: 'admin', password: 'pearadmin123', role: 'admin' },
  { id: 2, username: 'user1', password: 'password123', role: 'user' },
  { id: 3, username: 'user2', password: 'pearfan456', role: 'user' }
];

// Pear database
const pears = [
  { id: 1, name: 'Bartlett', origin: 'Europe', description: 'Sweet and juicy with a smooth, buttery texture', price: 2.99, image: 'bartlett.jpg' },
  { id: 2, name: 'Anjou', origin: 'Belgium', description: 'Refreshingly sweet and juicy with hints of citrus', price: 3.49, image: 'anjou.jpg' },
  { id: 3, name: 'Bosc', origin: 'France', description: 'Sweet-spicy flavor and firm, dense flesh', price: 4.29, image: 'bosc.jpg' },
  { id: 4, name: 'Comice', origin: 'France', description: 'Succulent, drippy, and exceptionally sweet', price: 5.99, image: 'comice.jpg' },
  { id: 5, name: 'Seckel', origin: 'United States', description: 'Bite-sized with sweet and spicy flavor', price: 3.99, image: 'seckel.jpg' }
];

// Routes
app.get('/', (req, res) => {
  res.render('index', { pears: pears, user: req.session.user });
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/pear/:id', (req, res) => {
  const pear = pears.find(p => p.id === parseInt(req.params.id));
  if (pear) {
    res.render('pear-detail', { pear, user: req.session.user });
  } else {
    res.status(404).render('404', { user: req.session.user });
  }
});

app.get('/admin', (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
    res.render('admin', { pears, users, user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

app.get('/profile', (req, res) => {
  if (req.session.user) {
    res.render('profile', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

app.post('/update-profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  // Update user information
  const userId = req.session.user.id;
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].username = req.body.username;
    // Update the session user as well
    req.session.user = users[userIndex];
    res.redirect('/profile');
  } else {
    res.status(404).send('User not found');
  }
});

app.get('/download', (req, res) => {
  const file = req.query.file;
  
  if (file) {
    const filePath = path.join(__dirname, 'uploads', file);
    
    // File traversal vulnerability
    res.sendFile(filePath);
  } else {
    res.status(400).send('No file specified');
  }
});

app.get('/pear-search', (req, res) => {
  const query = req.query.q || '';
  let results = [];
  
  if (query) {
    results = pears.filter(pear => 
      pear.name.toLowerCase().includes(query.toLowerCase()) ||
      pear.description.toLowerCase().includes(query.toLowerCase()) ||
      pear.origin.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  res.render('search', { query, results, user: req.session.user });
});

app.get('/contact', (req, res) => {
  res.render('contact', { user: req.session.user });
});

app.post('/submit-feedback', (req, res) => {
  const { name, email, message } = req.body;
  
  // XSS vulnerability - unvalidated user input rendered directly in page
  const feedbackHtml = `
    <div class="feedback-item">
      <h3>From: ${name} (${email})</h3>
      <p>${message}</p>
    </div>
  `;
  
  // In a real app, this would save to a database
  // For demo purposes, we'll just send it back in the response
  res.render('feedback-received', { feedback: feedbackHtml, user: req.session.user });
});

app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  if (!req.file) {
    return res.status(400).send('No image uploaded');
  }
  
  // CSRF vulnerability (no token validation)
  res.redirect('/profile');
});

app.get('/view-log', (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
    const logCommand = req.query.cmd || 'tail -n 10 access.log';
    
    // Command injection vulnerability
    const execSync = require('child_process').execSync;
    try {
      const output = execSync(logCommand, { encoding: 'utf8' });
      res.render('view-log', { output, user: req.session.user });
    } catch (error) {
      res.render('view-log', { output: error.message, user: req.session.user });
    }
  } else {
    res.redirect('/login');
  }
});

app.listen(port, () => {
  console.log(`Pear Paradise app running at http://localhost:${port}`);
});
