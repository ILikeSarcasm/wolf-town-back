/**
 * Application configuration section
 * http://pm2.keymetrics.io/docs/usage/application-declaration/
 */
module.exports = {
  apps: [{
    name: 'app',
    cwd: __dirname,
    script: `./app.js`,
    max_restarts: 500,
    exec_mode: 'cluster',
    instances: 1,
    max_memory_restart: '1024M',
    // ignore_watch: ['node_modules', 'logs', '.git', '.svn', '.eslintrc'],
    // watch: [],
  }],
};
