import { Request, Response, NextFunction } from 'express';
import { createClient, RedisClientType } from 'redis';
import config from '../config/config';
import { IArticle } from '../interfaces/article.interface';

let redisClient: RedisClientType | null = null;
let isRedisConnected = false;

const initializeRedis = async () => {
  if (!config.redisUrl) {
    console.warn('Redis URL not configured. Cache middleware will be disabled.');
    return;
  }

  try {
    redisClient = createClient({
      url: config.redisUrl
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
      isRedisConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('Redis client connected');
      isRedisConnected = true;
    });

    redisClient.on('disconnect', () => {
      console.warn('Redis client disconnected');
      isRedisConnected = false;
    });

    await redisClient.connect();
  } catch (err) {
    console.error('Failed to initialize Redis:', err);
    redisClient = null;
    isRedisConnected = false;
  }
};

initializeRedis();

interface CacheOptions {
  ttl?: number;
  keyPrefix?: string;
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  const { ttl = 3600, keyPrefix = 'cache' } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!redisClient || !isRedisConnected) {
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
          redisClient!.setEx(cacheKey, ttl, JSON.stringify(body))
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
  if (!redisClient || !isRedisConnected) {
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
  if (!redisClient || !isRedisConnected) {
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
  if (redisClient && isRedisConnected) {
    await redisClient.quit();
  }
};

export { redisClient };
