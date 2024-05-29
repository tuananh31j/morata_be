import 'dotenv/config';
import Joi from 'joi';

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(5555),
    MONGODB_URL_DEV: Joi.string().description('Local Mongo DB'),
    MONGODB_URL_CLOUD: Joi.string().description('Cloud Mongo DB'),
    FIREBASE_API_KEY: Joi.string().description('Firebase Api Key'),
    FIREBASE_AUTH_DOMAIN: Joi.string().description('Firebase Auth Domain'),
    FIREBASE_PROJECT_ID: Joi.string().description('Firebase Project Id'),
    FIREBASE_STORAGE_BUCKET: Joi.string().description('Firebase Storage Bucket'),
    FIREBASE_MESSAGING_SENDER_ID: Joi.string().description('Firebase Messaging Sender Id'),
    FIREBASE_APP_ID: Joi.string().description('Firebase App Id'),
    FIREBASE_MEASUREMENT_ID: Joi.string().description('Firebase Measurement Id'),
    STRIPE_PUBLIC_KEY: Joi.string().description('Stripe Public Key'),
    STRIPE_SECRET_KEY: Joi.string().description('Stripe Secrete Key'),
    JWT_ACCESS_TOKEN_KEY: Joi.string().required().description('JWT Access Token Key'),
    JWT_REFRESH_TOKEN_KEY: Joi.string().required().description('JWT Refresh Token Key'),
    JWT_ACCESS_EXPIRATION: Joi.string().default('15m').description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION: Joi.string().default('30d').description('days after which refresh tokens expire'),
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
  mongoose: {
    url: envVars.NODE_ENV === 'development' ? envVars.MONGODB_URL_DEV : envVars.MONGODB_URL_CLOUD,
    options: {
      dbName: 'morata',
    },
  },

  jwt: {
    accessTokenKey: envVars.JWT_ACCESS_TOKEN_KEY,
    refreshTokenKey: envVars.JWT_REFRESH_TOKEN_KEY,
    accessExpiration: envVars.JWT_ACCESS_EXPIRATION,
    refreshExpiration: envVars.JWT_REFRESH_EXPIRATION,
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
  stripeConfig: {
    publicKey: envVars.STRIPE_PUBLIC_KEY,
    secretKey: envVars.STRIPE_SECRET_KEY,
  },
};

export default config;
