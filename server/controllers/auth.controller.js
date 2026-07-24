import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: '30d',
  });
};

const getRolePermissions = async (roleName) => {
  if (!roleName) return [];
  if (roleName.toLowerCase() === 'admin') return 'all';
  const role = await prisma.role.findFirst({
    where: { name: { equals: roleName, mode: 'insensitive' } }
  });
  return role ? role.permissions : [];
};

const formatUser = (user) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  googleId: user.googleId,
});

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = email.toLowerCase() === 'azam.asghar26@gmail.com' ? 'admin' : 'customer';

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    const permissions = await getRolePermissions(user.role);
    res.status(201).json({
      ...formatUser(user),
      permissions,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (role && user.role !== role.toLowerCase()) {
      return res.status(401).json({ message: `Access denied. You are not registered as ${role}.` });
    }

    const permissions = await getRolePermissions(user.role);
    res.json({
      ...formatUser(user),
      permissions,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user) {
      const permissions = await getRolePermissions(user.role);
      res.json({ ...formatUser(user), permissions });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login with Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  const { accessToken } = req.body;
  console.log('--- Google Login Start ---');

  try {
    if (!accessToken) {
      return res.status(400).json({ message: 'No access token provided' });
    }

    let userData;
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      userData = response.data;
    } catch (googleError) {
      return res.status(401).json({
        message: 'Failed to fetch user data from Google',
        details: googleError.response?.data || googleError.message
      });
    }

    const { name, email, picture, sub: googleId } = userData;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const role = email.toLowerCase() === 'azam.asghar26@gmail.com' ? 'admin' : 'customer';
      user = await prisma.user.create({
        data: { name, email, password: null, avatar: picture, googleId, role },
      });
    }

    const token = generateToken(user.id);
    const permissions = await getRolePermissions(user.role);

    res.json({ ...formatUser(user), permissions, token });
    console.log('--- Google Login Success ---');
  } catch (error) {
    console.error('--- Google Login Unexpected Error ---', error);
    res.status(500).json({ message: 'Internal server error during Google login', error: error.message });
  }
};
