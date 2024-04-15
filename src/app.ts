import express, { Express } from 'express';
import 'dotenv/config';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Express = express();

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

export default app;
