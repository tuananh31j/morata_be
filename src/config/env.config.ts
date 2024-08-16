import 'dotenv/config';
import Joi from 'joi';

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development').required(),
        PORT: Joi.number().default(80),
        HOSTNAME: Joi.string().default('127.0.0.1'),
        MONGODB_URL_DEV: Joi.string().description('Local Mongo DB'),
        MONGODB_URL_CLOUD: Joi.string().description('Cloud Mongo DB'),

        SHIPPING_API_TOKEN: Joi.string().description('Shipping Api Token'),
        SHIPPING_API_ENDPOINT: Joi.string().description('Shipping Api Endpoint'),
        SHOP_ID: Joi.string().description('Shop Id'),
        FROM_DISTRICT_ID: Joi.number()
            .custom((value: string) => Number(value))
            .description('From District'),
        FROM_WARD_CODE: Joi.string().description('From Ward'),

        FIREBASE_API_KEY: Joi.string().description('Firebase Api Key'),
        FIREBASE_AUTH_DOMAIN: Joi.string().description('Firebase Auth Domain'),
        FIREBASE_PROJECT_ID: Joi.string().description('Firebase Project Id'),
        FIREBASE_STORAGE_BUCKET: Joi.string().description('Firebase Storage Bucket'),
        FIREBASE_MESSAGING_SENDER_ID: Joi.string().description('Firebase Messaging Sender Id'),
        FIREBASE_APP_ID: Joi.string().description('Firebase App Id'),
        FIREBASE_MEASUREMENT_ID: Joi.string().description('Firebase Measurement Id'),

        STRIPE_PUBLIC_KEY: Joi.string().description('Stripe Public Key'),
        STRIPE_SECRET_KEY: Joi.string().description('Stripe Secrete Key'),
        STRIPE_API_KEY: Joi.string().description('Stripe Api Key'),
        STRIPE_URL_SUCCESS: Joi.string().description('Stripe url success.'),
        STRIPE_URL_CANCEL: Joi.string().description('Stripe url cancel.'),
        STRIPE_WEBHOOK_ENDPOINT_SECRET: Joi.string().description('Stripe webhook endpoint secret.'),
        CLIENT_DOMAIN: Joi.string().description('Client domain'),

        JWT_ACCESS_TOKEN_KEY: Joi.string().required().description('JWT Access Token Key'),
        JWT_REFRESH_TOKEN_KEY: Joi.string().required().description('JWT Refresh Token Key'),
        JWT_ACCESS_EXPIRATION: Joi.string().default('15m').description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION: Joi.string().default('30d').description('days after which refresh tokens expire'),
        REDIS_HOST: Joi.string().description('Redis Host'),
        REDIS_PORT: Joi.number().description('Redis Port'),
        COOKIE_MAX_AGE: Joi.number()
            .empty()
            .default(1000 * 60 * 60 * 24 * 30)
            .custom((envVar: string) => Number(envVar))
            .description('Max age cookie'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    hostname: envVars.HOSTNAME,
    mongoose: {
        url: envVars.MONGODB_URL_CLOUD,
        options: {
            dbName: 'morata',
        },
    },

    jwt: {
        accessTokenKey: envVars.JWT_ACCESS_TOKEN_KEY,
        refreshTokenKey: envVars.JWT_REFRESH_TOKEN_KEY,
        verifyTokenKey: envVars.JWT_VERIFY_TOKEN_KEY,
        resetPasswordTokenKey: envVars.JWT_RESETPASSWORD_TOKEN_KEY,
        verifyExpiration: envVars.JWT_VERIFY_EXPIRATION,
        accessExpiration: envVars.JWT_ACCESS_EXPIRATION,
        refreshExpiration: envVars.JWT_REFRESH_EXPIRATION,
        resetPasswordExpiration: envVars.JWT_RESETPASSWORD_EXPIRATION,
    },
    cookie: {
        maxAge: envVars.COOKIE_MAX_AGE,
    },
    firebaseConfig: {
        apiKey: envVars.FIREBASE_API_KEY,
        authDomain: envVars.FIREBASE_AUTH_DOMAIN,
        projectId: envVars.FIREBASE_PROJECT_ID,
        storageBucket: envVars.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: envVars.FIREBASE_MESSAGING_SENDER_ID,
        appId: envVars.FIREBASE_APP_ID,
        measurementId: envVars.FIREBASE_MEASUREMENT_ID,
    },

    shipping: {
        apiToken: envVars.SHIPPING_API_TOKEN,
        apiEndpoint: envVars.SHIPPING_API_ENDPOINT,
        shopId: envVars.SHOP_ID,
        fromDistrictId: envVars.FROM_DISTRICT_ID,
        fromWardCode: envVars.FROM_WARD_CODE,
    },

    stripeConfig: {
        publicKey: envVars.STRIPE_PUBLIC_KEY,
        secretKey: envVars.STRIPE_SECRET_KEY,
        urlSuccess: envVars.STRIPE_URL_SUCCESS,
        urlCancel: envVars.STRIPE_URL_CANCEL,
        endpointSecret: envVars.STRIPE_WEBHOOK_ENDPOINT_SECRET,
    },
    clientDomain: {
        url: envVars.CLIENT_DOMAIN,
        verify: envVars.VERIFY_URL,
    },
    nodeMailer: {
        email: envVars.EMAIL_USER,
        password: envVars.EMAIL_PASSWORD,
    },
};

export default config;
