import knex from 'knex';
import knexFile from './knexfile';
import { Logger } from '@nestjs/common';
const logger = new Logger();

const NODE_ENV = process.env.NODE_ENV || 'development';

// Get the database configuration for the specified environment.
const dbEnv = knexFile[NODE_ENV];

logEnvironment();

const db = knex(dbEnv);

export default db;

// Define a function to log the environment.
function logEnvironment() {
  logger.log(`Using the '${NODE_ENV}' environment for the database.`);
}
