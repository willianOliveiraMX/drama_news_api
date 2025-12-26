import { Request, Response, NextFunction } from 'express';
import { status } from 'http-status';

interface ValidationRules {
  [key: string]: {
    type: 'number' | 'string';
    min?: number;
    max?: number;
    required?: boolean;
    default?: number | string;
  };
}

export const validateQueryParams = (rules: ValidationRules) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    for (const [param, rule] of Object.entries(rules)) {
      const value = req.query[param];

      if (rule.required && !value) {
        errors.push(`Parameter '${param}' is required`);
        continue;
      }

      if (!value && rule.default !== undefined) {
        req.query[param] = String(rule.default);
        continue;
      }

      if (value && rule.type === 'number') {
        const numValue = Number(value);
        
        if (isNaN(numValue)) {
          errors.push(`Parameter '${param}' must be a valid number`);
          continue;
        }

        if (rule.min !== undefined && numValue < rule.min) {
          errors.push(`Parameter '${param}' must be greater than or equal to ${rule.min}`);
        }

        if (rule.max !== undefined && numValue > rule.max) {
          errors.push(`Parameter '${param}' must be less than or equal to ${rule.max}`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(status.BAD_REQUEST).json({
        statusCode: status.BAD_REQUEST,
        errors,
        message: 'Invalid parameters'
      });
    }

    next();
  };
};

export const validateArticleParams = validateQueryParams({
  limit: {
    type: 'number',
    min: 1,
    max: 100,
    default: 4
  },
  offset: {
    type: 'number',
    min: 0,
    default: 0
  }
});

export const validateSlugParam = (req: Request, res: Response, next: NextFunction) => {
  const slug = String(req.query.slug || '');

  const slugPattern = /^\/[a-z-]+\/\d{4}-\d{2}-\d{2}\/[a-z0-9-]+$/;

  if (!slug) {
    return res.status(status.BAD_REQUEST).json({
      statusCode: status.BAD_REQUEST,
      errors: ['Slug parameter is required'],
      message: 'Invalid slug'
    });
  }

  if (!slugPattern.test(slug)) {
    return res.status(status.BAD_REQUEST).json({
      statusCode: status.BAD_REQUEST,
      errors: [
        'Slug must be in the format: /category/YYYY-MM-DD/article-title',
        'Example: /terror/2025-02-15/nova-serie-de-it-a-coisa'
      ],
      message: 'Invalid slug format'
    });
  }

  const datePart = slug.split('/')[2];
  const [year, month, day] = datePart.split('-').map(Number);
  
  const date = new Date(year, month - 1, day);
  const isValidDate = 
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isValidDate) {
    return res.status(status.BAD_REQUEST).json({
      statusCode: status.BAD_REQUEST,
      errors: ['The date in the slug is invalid'],
      message: 'Invalid date in slug'
    });
  }

  next();
};
