const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Add .bin to the asset extensions list
  config.resolver.assetExts.push('bin');

  return config;
})();