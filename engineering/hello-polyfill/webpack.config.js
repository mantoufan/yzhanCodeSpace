module.exports = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_moduels)/,
        loader: "babel-loader",
      }
    ]
  }
}