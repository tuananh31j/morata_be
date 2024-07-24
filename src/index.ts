import app from './app';
import config from './config/env.config';
import connectDB from './config/database.config';
import { addOrderToQueue, processOrderQueue } from './helpers/queue';

const PORT = config.port;
const HOSTNAME = config.hostname;

let server: any;
connectDB().then(() => {
    addOrderToQueue();

    server = app.listen(PORT, `${HOSTNAME}`, () => {
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

// Handle update order status automatically
processOrderQueue();

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
        server.close();
    }
});
