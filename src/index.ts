import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5555;

let server: any;
mongoose.connect('mongodb://localhost:27017').then(() => {
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
