module.exports = {
  apps: [
    {
      name: "spiderweb",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_file: "prod.env",
      exec_mode: "fork",
      instances: 1,
      log_file: "/var/log/pm2/spiderweb-combined.log",
      error_file: "/var/log/pm2/spiderweb-error.log",
      out_file: "/var/log/pm2/spiderweb-out.log",
    },
  ],
};
