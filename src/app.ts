import express, { Express } from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import notFoundHandler from './middlewares/notFoundHandlerMiddleware';
import errorHandler from './middlewares/errorHandlerMiddleware';
import router from './routes';
import { corsOptions } from './config/corsOptions';

const app: Express = express();

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

export default app;
