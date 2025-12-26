import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 600000,
  max: 100,
  message: {
    statusCode: 429,
    message: 'Too many requests, please try again later.'
  }
});

export default limiter;
