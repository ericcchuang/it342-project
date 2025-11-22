module.exports = {
  apps: [
    {
      name: "spiderwebapi",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      env_file: "prod.env",
      exec_mode: "fork",
      instances: 1,
    },
  ],
};
