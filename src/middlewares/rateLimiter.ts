import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import redisClient from '../redis';

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 3,
  duration: 60,
});

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  rateLimiter.consume(req.ip as string)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({
        message: 'Muitas tentativas! Tente novamente em 1 minuto.',
        error: 'Too Many Requests'
      });
    });
};