import express, { Express } from 'express';
import PinoHttp from "pino-http";
import cors from "cors";
import * as bodyParser from 'body-parser';

import routes from './routes';
import config from './config/config';
// import errorHandler from './middlewares/errorHandler';

const app:Express = express();
const port:number = config.port;

const pino = PinoHttp();

app.use(pino);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);
// app.use(errorHandler);

app.listen(port, () => {
  pino.logger.info(`App successfully running at ${port}`);
});
