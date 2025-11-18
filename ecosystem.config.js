module.exports = {
  apps: [
    {
      name: "spiderweb",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
      env_file: "prod.env",
      exec_mode: "fork",
      instances: 1,
    },
  ],
};
