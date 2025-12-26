import app from './app';
import config from './config/config';
import PinoHttp from "pino-http";

const pino = PinoHttp();
const port: number = config.port;

app.listen(port, () => {
  pino.logger.info(`App successfully running at ${port}`);
});