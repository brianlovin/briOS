/**
 * Not using ts-loader but transpiling with babel 7, thanks to @babel/preset-typescript
 * https://babeljs.io/docs/en/babel-preset-typescript
 *
 * For the test files, using TypeScript for completion (more than typing).
 * This is why spec.tsx? files re ignored (unit and e2e test files).
 */
module.exports = {
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  }
};