module.exports = {
  apps: [
    {
      name: 'morata_be',
      script: 'npx',
      args: "nodemon --exec 'ts-node' ./src/index.ts", // Ensure the path to your main file is correct
      interpreter: 'none',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
