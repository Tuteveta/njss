module.exports = {
  apps: [
    {
      name: "njss",
      script: "node_modules/.bin/next",
      args: "start -p 8080",
      cwd: "/var/www/njss",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env_production: {
        NODE_ENV: "production",
        PORT: 8080,
      },
    },
  ],
}
