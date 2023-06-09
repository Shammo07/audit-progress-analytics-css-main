const withPlugins = require("next-compose-plugins");

const path = require("path");


module.exports = withPlugins([ ], {
  webpack(config, options) {
    config.resolve.modules.push(path.resolve("./"));
    config.resolve.fallback ={
      fs:false,
      child_process:false
    }
    return config;
  },
  webpack5: true,
  experimental: {
    outputStandalone: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compiler:{
    removeConsole: process.env.NODE_ENV === "production"
  }
});
