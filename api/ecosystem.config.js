module.exports = {
  apps: [
    {
      name: "express-api",
      script: "server.js",
      interpreter: "node",
      env_file: "prod.env",
      env: {
        PORT: 3001,
      },
      watch: false,
      ignore_watch: ["node_modules", "logs"],
      log_file: "/var/log/pm2/express-api-combined.log",
      error_file: "/var/log/pm2/express-api-error.log",
      out_file: "/var/log/pm2/express-api-out.log",
    },
  ],
};
