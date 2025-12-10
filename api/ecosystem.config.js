export default {
  apps: [
    {
      name: "spiderwebapi",
      script: "./api/express.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_file: "prod.env",
      exec_mode: "fork",
      instances: 1,
    },
  ],
};
