import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Express } from 'express';
import { initializeApp } from 'firebase/app';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors.config';
import firebaseConfig from './config/firebase.config';
import { checkoutController } from './controllers';
import errorHandler from './middlewares/errorHandlerMiddleware';
import notFoundHandler from './middlewares/notFoundHandlerMiddleware';
import router from './routes';

const app: Express = express();

// firebase app
initializeApp(firebaseConfig);

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

app.use(cookieParser());

// webhook
app.post('/webhook', express.raw({ type: 'application/json' }), checkoutController.handleSessionEvents);

app.use(
    express.json({
        limit: '5mb',
    }),
);
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1', router);

//error middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
