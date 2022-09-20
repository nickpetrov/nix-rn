module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          src: './src',
          components: './src/components',
          screens: './src/screens',
          navigation: './src/navigation',
          constants: './src/constants',
          store: './src/store',
          helpers: './src/helpers',
          hooks: './src/hooks',
          assets: './src/assets',
          api: './src/api',
          config: './src/config',
        },
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
  ],
};
