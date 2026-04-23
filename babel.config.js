module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ... plugin lain jika ada
      'react-native-reanimated/plugin', 
    ],
  };
};