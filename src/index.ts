import app from './app';
import config from './config/env.config';
import connectDB from './config/database.config';

const PORT = config.port;

let server: any;
connectDB().then(() => {
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
