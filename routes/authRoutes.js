const express = require('express');
const { signup, login, verifyEmail } = require('../controllers/authController'); // Include verifyEmail
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route for signing up new users
router.post('/signup', signup);
router.get('verify/:token', verifyEmail);

// Route for logging in existing users
router.post('/login', login);

// Example protected route (to get user profile)
router.get('/profile', protect, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

module.exports = router;
