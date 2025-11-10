require('dotenv').config();

const express = require('express');
const passport = require('passport');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// session + passport initialization
app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET || 'change-this',
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

// mount auth routes (auth.js configures strategy + routes)
const authRouter = require('./auth');
app.use(authRouter);

// simple home and profile routes
app.get('/', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) return res.redirect('/profile');
  res.send(`
    <h1>Google OAuth Demo</h1>
    <form action="/auth/google" method="get">
      <button type="submit">Login with Google</button>
    </form>
  `);
});

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) return res.redirect('/');
  res.send(`
    <h1>Welcome ${req.user.name}!</h1>
    <p>${req.user.email || ''}</p>
    <form action="/logout" method="get" style="margin-top:1rem;">
      <button type="submit">Logout</button>
    </form>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});