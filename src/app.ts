import express, { Express } from 'express';
import 'dotenv/config';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandlerMiddleware from './middlewares/errors/errorHandlerMiddleware';
import notFound from './middlewares/errors/notFound';
import router from './routes';

const app: Express = express();

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// routes
app.use('api/v1/', router);

// error middleware
app.use('*', notFound);
app.use(errorHandlerMiddleware);

export default app;
