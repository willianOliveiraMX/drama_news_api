import request from 'supertest';
import app from '../../app';

jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    setEx: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    keys: jest.fn().mockResolvedValue([]),
    ttl: jest.fn().mockResolvedValue(-1),
    on: jest.fn(),
  })),
}));

describe('GET /api/v1/articles', () => {
  afterAll(async () => {
    app.removeAllListeners();
  });
  describe('when articles exist', () => {
    it('should return 200 and a list of articles', async () => {
      const response = await request(app)
        .get('/api/v1/articles')
        .query({ limit: 10, offset: 0 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body).toHaveProperty('body');
      expect(response.body.body).toHaveProperty('data');
      expect(Array.isArray(response.body.body.data)).toBe(true);
      expect(response.body.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('when no articles are found', () => {
    it('should return 404 with not found message when offset is too high', async () => {
      const response = await request(app)
        .get('/api/v1/articles')
        .query({ limit: 10, offset: 99999 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('statusCode', 'Not Found');
      expect(response.body).toHaveProperty('body');
      expect(response.body.body).toHaveProperty('message', 'Not able to find any article');
    });
  });
});

describe('GET /api/v1/articles/slug', () => {
  afterAll(async () => {
    app.removeAllListeners();
  });
  describe('when article with slug exists', () => {
    it('should return 200 and the article', async () => {
      const response = await request(app)
        .get('/api/v1/articles/slug')
        .query({ slug: '/terror/2025-02-15/nova-serie-de-it-a-coisa' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body).toHaveProperty('body');
      expect(response.body.body).toHaveProperty('data');
      expect(response.body.body.data).toHaveProperty('slug', '/terror/2025-02-15/nova-serie-de-it-a-coisa');
    });
  });

  describe('when article with slug does not exist', () => {
    it('should return 404 with not found', async () => {
      const response = await request(app)
        .get('/api/v1/articles/slug')
        .query({ slug: '/teste/2025-02-19/nova-serie-de-it-a-coisa' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('statusCode', 'Not Found');
      expect(response.body).toHaveProperty('body');
      expect(response.body.body).toHaveProperty('message', 'Not able to find any article');
    });

    it('should return 400 when slug is not valid ', async () => {
      const response = await request(app)
        .get('/api/v1/articles/slug')
        .query({ slug: 'invalid-slug' });

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toEqual({"errors": ["Slug must be in the format: /category/YYYY-MM-DD/article-title", "Example: /terror/2025-02-15/nova-serie-de-it-a-coisa"], "message": "Invalid slug format", "statusCode": 400});
    });
  });
});

