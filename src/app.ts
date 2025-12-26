import express, { Express } from 'express';
import PinoHttp from "pino-http";
import cors from "cors";
import * as bodyParser from 'body-parser';

import routes from './routes';
import limiter from './middlewares/rateLimite';

const app:Express = express();

const pino = PinoHttp();

app.use(pino);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);
app.use(limiter);

export default app;
