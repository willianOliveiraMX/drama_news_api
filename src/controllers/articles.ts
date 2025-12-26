import { Request, Response, Router } from 'express';
import { status } from "http-status";
import cors from 'cors';
import { getAllArticles, getArticleBySlug } from '../models/article.model';
import { validateArticleParams, validateSlugParam } from '../middlewares/validateQueryParams';
import { cacheMiddleware } from '../middlewares/cache';
import config from '../config/config';

const router = Router();

const corsOptions = {
  origin: config.corsOrigin,
};

router.get(
  '/v1/articles', 
  cors(corsOptions), 
  validateArticleParams,
  cacheMiddleware({ ttl: 1800, keyPrefix: 'articles' }),
  async (req: Request, res: Response) => {
  try {
    const articles = await getAllArticles({ limit: Number(req.query.limit), offset: Number(req.query.offset)});

    if (!articles.length) {
      req.log.warn({ limit: req.query.limit, offset: req.query.offset }, 'No articles found');

      return res.status(status.NOT_FOUND).json({
        statusCode: status[404],
        body: {
          message: "Not able to find any article"
        }
      });
    }

    req.log.info({ count: articles.length }, 'Articles retrieved successfully');
    res.json({
      statusCode: status.OK,
      body: {
        data: articles
      }
    });
  } catch (err) {
    req.log.error({ err, query: req.query }, 'Error fetching articles');

    res.status(status.INTERNAL_SERVER_ERROR).json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      body: {
        message: "Unexpected error"
      }
    });
  }
});

router.get(
  '/v1/articles/slug', 
  cors(corsOptions), 
  validateSlugParam,
  cacheMiddleware({ ttl: 3600, keyPrefix: 'article-slug' }), // Cache de 1 hora
  async (req: Request, res: Response) => {
  try {
    const article = await getArticleBySlug({ slug: String(req.query.slug) });

    if (!article) {
      req.log.warn({ slug: req.query.slug }, 'Article not found');
  
      return res.status(status.NOT_FOUND).json({
        statusCode: status[404],
        body: {
          message: "Not able to find any article"
        }
      });
    }

    req.log.info({ slug: req.query.slug }, 'Article retrieved successfully');
    res.json({
      statusCode: status.OK,
      body: {
        data: article
      }
    });
  } catch (err) {
    req.log.error({ err, slug: req.query.slug }, 'Error fetching article by slug');
  
    res.status(status.INTERNAL_SERVER_ERROR).json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      body: {
        message: "Unexpected error"
      }
    });
  }
});

export default router;
