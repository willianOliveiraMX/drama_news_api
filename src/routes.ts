import { Router } from "express";

import articleController from './controllers/articles';

const api:Router = Router()
  .use(articleController)

export default Router().use('/api', api);
