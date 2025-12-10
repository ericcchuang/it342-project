module.exports = {
  apps: [
    {
      name: "spiderwebapi",
      script: "./express.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_file: ".env",
      exec_mode: "fork",
      instances: 1,
    },
  ],
};
