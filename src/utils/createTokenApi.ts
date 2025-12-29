import jwt from 'jsonwebtoken';
import config from '../config/config';

interface TokenPayload {
  sitename: string;
  role: string;
}

export const createToken = (payload: TokenPayload): string => {
  const secretKey = config.jwtSecret;
  return jwt.sign(payload, secretKey);
};

const readToken = (token: string) => {
  const secretKey = config.jwtSecret;
  return jwt.verify(token, secretKey);
};

export default readToken;