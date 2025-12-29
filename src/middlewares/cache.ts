import { Request, Response, NextFunction } from 'express';
import { IArticle } from '../interfaces/article.interface';
import redisInstance from '../database/redis';

redisInstance.connect();

interface CacheOptions {
  ttl?: number;
  keyPrefix?: string;
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  const { ttl = 3600, keyPrefix = 'cache' } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    const redisClient = redisInstance.getClient();
    
    if (!redisClient || !redisInstance.isConnected()) {
      return next();
    }

    try {
      const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
      const cacheKey = `${keyPrefix}:${req.path}${queryString ? `:${queryString}` : ''}`;

      const cachedData = await redisClient.get(cacheKey);

      if (cachedData && typeof cachedData === 'string') {
        req.log.info({ cacheKey, ttl }, 'Cache hit - Returning cached data');
        return res.json(JSON.parse(cachedData) as IArticle);
      }

      req.log.info({ cacheKey, ttl }, 'Cache miss - Fetching data');

      const originalJson = res.json.bind(res);
      res.json = (body: IArticle) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient.setEx(cacheKey, ttl, JSON.stringify(body))
            .then(() => {
              req.log.info({ cacheKey, ttl, expiresIn: `${ttl}s` }, 'Data saved to cache');
            })
            .catch(err => {
              req.log.error({ err, cacheKey }, 'Error saving to cache');
            });
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      req.log.error({ err }, 'Error in cache middleware');
      next();
    }
  };
};
