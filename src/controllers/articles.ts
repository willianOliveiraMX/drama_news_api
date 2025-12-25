import { NextFunction, Request, Response, Router } from 'express';
import { status } from "http-status";

const router = Router();

router.get('/v1/articles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      statusCode: status.OK,
      body: {
        data: 'List of articles'
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
