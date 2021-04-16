module.exports = {
  apps: [
    {
      name: 'farm-simulator-api',
      script: './dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
