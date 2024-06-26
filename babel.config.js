module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Remove 'expo-router/babel' as it is deprecated
      "react-native-reanimated/plugin",
    ]
  };
};

