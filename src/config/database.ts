import mongoose, { ConnectOptions, Error } from 'mongoose';
import config from './config';

mongoose.set('strictQuery', true);

// Connecting to MongoDB(Connecting to the Database)
export const connectDB = () => {
  // @event connected: Emitted when this connection successfully connects to the db. May be emitted multiple times in reconnected scenarios
  mongoose.connection.on('connected', () => {
    if (config.env && config.env === 'development') {
      console.log('MongoDB database connection established successfully');
    }
  });

  mongoose.connection.on('reconnected', () => {
    if (config.env && config.env === 'development') {
      console.log('Mongo Connection Reestablished');
    }
  });

  // @event error: Emitted when an error occurs on this connection.
  mongoose.connection.on('error', (error: Error) => {
    if (config.env && config.env === 'development') {
      console.log('MongoDB connection error. Please make sure MongoDB is running: ');
      console.log(`Mongo Connection ERROR: ${error}`);
    }
  });

  // @event close
  mongoose.connection.on('close', () => {
    if (config.env && config.env === 'development') {
      console.log('Mongo Connection Closed...');
    }
  });

  // @event disconnected: Emitted after getting disconnected from the db
  mongoose.connection.on('disconnected', () => {
    if (config.env && config.env === 'development') {
      console.log('MongoDB database connection is disconnected...');
      console.log('Trying to reconnect to Mongo ...');
    }

    setTimeout(() => {
      mongoose.connect(config.mongoose.url, {
        socketTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      } as ConnectOptions);
    }, 3000);
  });

  // @event close: Emitted after we disconnected and onClose executed on all of this connections models.
  process.on('SIGINT', () => {
    mongoose.connection.close().then(() => {
      if (config.env && config.env === 'development') {
        console.log('MongoDB database connection is disconnected due to app termination...');
      }

      process.exit(0); // close database connection
    });
  });

  // mongoose.connect return promise
  mongoose.connect(config.mongoose.url, {} as ConnectOptions);

  return mongoose.connect(config.mongoose.url, { dbName: 'unicorn' });
};

export default connectDB;
