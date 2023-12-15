import mysql, { ConnectionOptions } from 'mysql2';

const {
    DDD_FORUM_DB_USER,
    DDD_FORUM_DB_PASS,
    DDD_FORUM_DB_HOST,
    DDD_FORUM_DB_DEV_DB_NAME,
  } = process.env;

const connectionOptions: ConnectionOptions = {
    host: DDD_FORUM_DB_HOST,
    database: DDD_FORUM_DB_DEV_DB_NAME,
    user: DDD_FORUM_DB_USER,
    password: DDD_FORUM_DB_PASS
  };

export const createConection = () => mysql.createConnection(connectionOptions)