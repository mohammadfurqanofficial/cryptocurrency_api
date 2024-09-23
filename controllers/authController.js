const User = require('../models/User'); // Adjust the import based on your structure
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configure your email transporter (using Nodemailer)
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// @desc    Generate token for verification
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// @desc    Register user and send verification email
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    // Generate a verification token
    const verificationToken = generateToken(user._id);
    
    // Send verification email
    const verificationUrl = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      text: `Click this link to verify your email: ${verificationUrl}`,
    });

    res.status(201).json({
      message: 'User registered. Verification email sent.',
      token: verificationToken, // Optionally include the verification token
    });
  } catch (error) {
    console.error('Signup error:', error); // Log error for debugging
    res.status(500).json({ error: error.message });
  }
};

// @desc    Verify email using token
// @route   GET /api/auth/verify/:token
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and update their verified status
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true; // Ensure your User model has this field
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error); // Log error for debugging
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// @desc    Authenticate user and get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ token: generateToken(user._id) });
  } catch (error) {
    console.error('Login error:', error); // Log error for debugging
    res.status(500).json({ error: error.message });
  }
};
