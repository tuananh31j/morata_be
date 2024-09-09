import config from '@/config/env.config';

export const allowedOrigins = [
    config.clientDomain.url,
    'http://localhost:5173',
    'http://localhost',
    'http://localhost:80',
    'http://34.229.217.0',
    'ec2-34-229-217-0.compute-1.amazonaws.com',
];
