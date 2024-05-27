require('dotenv').config({ path: './../../.env' });

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD
    },
    
    migrations: {
      directory: './migrations'
    },

    seeds: {
      directory: './seeds',
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD
    },
    
    migrations: {
      directory: './migrations'
    },

    seeds: {
      directory: './seeds',
    }
  }

};
