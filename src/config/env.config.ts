import 'dotenv/config';
import Joi from 'joi';

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(5555),
    MONGODB_URL_DEV: Joi.string().description('Local Mongo DB'),
    MONGODB_URL_CLOUD: Joi.string().description('Cloud Mongo DB'),
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
};

export default config;
