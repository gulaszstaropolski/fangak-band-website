module.exports = {
  apps: [
    {
      name: "fangak-website",
      cwd: "./frontend",
      script: "npm",
      args: "start",
      env: { NODE_ENV: "production", PORT: 3000 },
    },
    {
      name: "fangak-cms",
      cwd: "./cms",
      script: "npm",
      args: "run start",
      env: { NODE_ENV: "production", HOST: "0.0.0.0", PORT: 1337 },
    },
  ],
};
