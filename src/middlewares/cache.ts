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
        req.log.info({ cacheKey, ttl }, 'Cache hit - Retornando dados em cache');
        return res.json(JSON.parse(cachedData) as IArticle);
      }

      req.log.info({ cacheKey, ttl }, 'Cache miss - Buscando dados');

      const originalJson = res.json.bind(res);
      res.json = (body: IArticle) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient.setEx(cacheKey, ttl, JSON.stringify(body))
            .then(() => {
              req.log.info({ cacheKey, ttl, expiresIn: `${ttl}s` }, 'Dados salvos no cache');
            })
            .catch(err => {
              req.log.error({ err, cacheKey }, 'Erro ao salvar no cache');
            });
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      req.log.error({ err }, 'Erro no middleware de cache');
      next();
    }
  };
};

export const invalidateCache = async (pattern: string): Promise<number> => {
  const redisClient = redisInstance.getClient();

  if (!redisClient || !redisInstance.isConnected()) {
    return 0;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      return keys.length;
    }
    return 0;
  } catch (err) {
    console.log(err);
    return 0;
  }
};

export const getCacheTTL = async (key: string): Promise<number> => {
  const redisClient = redisInstance.getClient();

  if (!redisClient || !redisInstance.isConnected()) {
    return -1;
  }

  try {
    return await redisClient.ttl(key);
  } catch (err) {
    console.log(err);
    return -1;
  }
};

export const disconnectRedis = async (): Promise<void> => {
  await redisInstance.disconnect();
};

