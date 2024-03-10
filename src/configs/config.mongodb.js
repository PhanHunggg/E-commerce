const dev = {
  app: {
    port: process.env.DEV_APP_PORT,
    name: process.env.DEV_APP_NAME,
  },
  db: {
    host: process.env.DEV_DB_HOST,
    pass: process.env.DEV_DB_PASS,
    name: process.env.DEV_DB_NAME,
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT,
    name: process.env.PRO_APP_NAME,
  },
  db: {
    host: process.env.PRO_DB_HOST,
    pass: process.env.PRO_DB_PASS,
    name: process.env.DEV_DB_NAME,
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
