import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config/env.js';

const client = new OAuth2Client(config.googleClientId);

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id, user.email),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.password && (await user.matchPassword(password))) {
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id, user.email),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Google Sign In / Sign Up
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400);
    throw new Error('No token provided');
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.googleClientId,
  });
  
  const payload = ticket.getPayload();
  const { sub: googleId, email, name } = payload;

  let user = await User.findOne({ email });

  if (user) {
    // If user exists but no googleId is attached, optionally attach it.
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
  } else {
    // Create new user
    user = await User.create({
      name,
      email,
      googleId,
    });
  }

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token: generateToken(user._id, user.email),
  });
});
