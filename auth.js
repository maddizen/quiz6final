const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Register route (simplified for example)
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const newUser = new User({ username, password, role });
  await newUser.save();
  res.redirect('/login');
});

// Login route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Middleware to check if user is seller
router.get('/dashboard', (req, res, next) => {
  if (!req.user || req.user.role !== 'seller') {
    return res.redirect('/401');
  }
  res.render('seller-dashboard');  // Render seller dashboard view
});

module.exports = router;
