// src/config/env.ts

import * as dotenv from 'dotenv';
import * as Joi from 'joi';

dotenv.config();

// Define the environment variables schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  DB_URI: Joi.string().uri().required(),
  API_KEY: Joi.string().required(),
}).unknown();

// Validate the environment variables
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Configuration error: ${error.message}`);
}

// Export validated environment variables
export const config = {
  environment: envVars.NODE_ENV,
  port: envVars.PORT,
  dbUri: envVars.DB_URI,
  apiKey: envVars.API_KEY,
};
