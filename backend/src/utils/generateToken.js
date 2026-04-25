import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateToken = (id, email) => {
  return jwt.sign({ id, email }, config.jwtSecret, {
    expiresIn: '7d',
  });
};
