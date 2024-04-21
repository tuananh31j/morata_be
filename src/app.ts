import express, { Express } from 'express';
import 'dotenv/config';
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1', router);

//error middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
