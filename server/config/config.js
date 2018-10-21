import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  FCM_SERVER_KEY,
  PORT,
  JWT
} from 'babel-dotenv';

var config = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
  port: PORT || 3010,
  // 10 days in seconds
  expireTime: process.env.JWT_EXPIRATION_TIME || 24 * 60 * 60 * 10,
  secrets: {
    jwt: JWT || 'venom'
  },
  db: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
  },
  fcmServerKey: FCM_SERVER_KEY
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

var envConfig;
// require could error out if
// the file don't exist so lets try this statement
// and fallback to an empty object if it does error out
try {
  envConfig = require('./' + config.env);
  // just making sure the require actually
  // got something back :)
  envConfig = envConfig || {};
} catch (e) {
  envConfig = {};
}

// merge the two config files together
// the envConfig file will overwrite properties
// on the config object
// export default Object.assign(config, envConfig.default);
export default {
  ...config,
  ...envConfig.default
};
