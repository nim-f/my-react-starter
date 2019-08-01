const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//const { BabelMultiTargetPlugin } = require('webpack-babel-multi-target-plugin')

module.exports = env => {
  const isProduction = env === 'production'
  return {
    resolve: {
      mainFields: [
        'es2015',
        'module',
        'main',
      ],
    },
    output: {
      path: path.resolve(__dirname, "build"),
      filename: () => isProduction ? 'static/js/[name].[chunkhash:8].js' : 'static/js/bundle.js',
      publicPath: '/',
    },
    devServer: {
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'static/images',
                name: '[name].[ext]',

              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: env === 'development',
              },
            },
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  require('postcss-pr')({ fontSize: 16 }),
                  require('postcss-nested'),
                  require('postcss-preset-env')({
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                  }),
                ],
              }
            }
          ],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: isProduction ? 'static/css/[name].[hash:8].css' : 'static/css/[name].css',
        chunkFilename: isProduction ? 'static/css/[id].[hash:8].css' : 'static/css/[id].css',
      }),
    ]
  }

};
