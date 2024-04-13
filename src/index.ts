import app from './app';
import mongoose from 'mongoose';
import config from './config/config';

const PORT = config.port;

let server: any;
mongoose
  .connect(`${config.mongoose.url}`, {
    dbName: config.mongoose.options.dbName,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    server = app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    });
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  console.log(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
