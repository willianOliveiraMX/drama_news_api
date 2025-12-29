import express, { Express } from 'express';
import PinoHttp from "pino-http";
import cors from "cors";
import * as bodyParser from 'body-parser';

import routes from './routes';
import limiter from './middlewares/rateLimite';
// import { createToken } from './utils/createTokenApi';

const app:Express = express();

const pino = PinoHttp();

// const tokenResult = createToken({ sitename: 'drama-news-api', role: 'api' });
// console.log('Generated API Token:', tokenResult);

app.use(pino);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);
app.use(limiter);

export default app;
