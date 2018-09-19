module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
   // Target server hostname or IP address
  //const TARGET_SERVER_HOST = process.env.TARGET_SERVER_HOST ? process.env.TARGET_SERVER_HOST.trim() : '';
  // Target server username
  //const TARGET_SERVER_USER = process.env.TARGET_SERVER_USER ? process.env.TARGET_SERVER_USER.trim() : '';
  // Target server application path
  //const TARGET_SERVER_APP_PATH = `/home/${TARGET_SERVER_USER}/app`;
  // Your repository
  //const REPO = 'git@gitlab.com:yourUsername/test-server.git';
  apps : [

    // First application
    {
      name      : 'API',
      script    : 'app.js',
      "env_production": {
           "NODE_ENV": "production",
           "MONGO_URI":   "mongodb://nestwork:nest1234@ds213199.mlab.com:13199/nestwork",
           "COOKIE_SECRET": "mySecret",
      },
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }

  /**
    },      
  ],
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'root',
      host : '149.129.212.12', //212.83.163.1
      ref  : 'origin/master',
      repo : 'git@gitlab.com:mtd_team/nestyards/intership/backend-nestwork.git',      
      path : './app/app.js',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'root',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@gitlab.com:mtd_team/nestyards/intership/backend-nestwork.git',
      path : '/var/www',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
