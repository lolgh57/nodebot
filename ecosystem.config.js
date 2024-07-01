module.exports = {
  apps: [
    {
      name: "telegram-bot",
      script: "node_modules/nodemon/bin/nodemon.js",
      args: "index.js",
      watch: true,
      ignore_watch: ["node_modules"],
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      exec_mode: "fork",
    },
  ],
};
