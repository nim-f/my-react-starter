const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//const { BabelMultiTargetPlugin } = require('webpack-babel-multi-target-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = env => {
  const isProduction = env === 'production'
  return {
    resolve: {
      mainFields: [
        'es2015',
        'module',
        'main',
      ]
    },
    output: {
      path: path.resolve(__dirname, "build"),
      filename: () => isProduction ? 'static/js/[name].[contenthash].js' : 'static/js/bundle.js',
      chunkFilename: '[id].[contenthash].js',
      publicPath: '/',
    },
    devServer: {
      historyApiFallback: true,
      stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: false,
        warnings: true,
        publicPath: false,
      },
    },
    devtool: isProduction ? false : 'source-map',
    optimization: {
      usedExports: true,
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
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
          test: /\.(png|jpe?g|gif|svg|webp|mp4|pdf)$/,
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
          test: /\.(eot|woff|woff2|ttf)([\?]?.*)$/,
          use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'static/fonts',
              name: '[name].[ext]',
            },
          }]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !isProduction,
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
                  require('postcss-simple-vars')({
                    variables: {
                      openBlue: '#00bef0',
                      tablet: `(max-width: 1024px)`,
                      mobile: `(max-width: 640px)`
                    },
                  }),
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
        },
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
        // filename: isProduction ? 'static/css/[name].[hash:8].css' : 'static/css/[name].css',
        // chunkFilename: isProduction ? 'static/css/[id].[hash:8].css' : 'static/css/[id].css',
        filename: 'static/css/[name].[contenthash].css',
        chunkFilename: 'static/css/[id].[contenthash].css',
      }),
      // new BundleAnalyzerPlugin(),
      // new ImageminWebpWebpackPlugin(),
      new CopyPlugin([
        { from: 'src/favicon/', to: 'static/favicon/' },
      ]),
    ],

  }

};
