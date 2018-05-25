// require('dotenv').config();
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

const options = {
    devTool: 'source-map',
    uglify: {}
}

// if (process.env.NODE_ENV === 'production') {
//   options.devTool = '';
//   module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({
//     compress: { warnings: false }
//   }))
// }


module.exports = {
    entry: ['babel-polyfill', './block-planes-client/src/index.jsx'],
    output: {
        filename: './block-planes-client/public/bundle.js'
    },
    watch: true,
    devtool: options.devTool,
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                }
            },
            {
                test: /\.(scss|css)$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                optimizationLevel: 7,
                            },
                            pngquant: {
                                quality: 65,
                            },
                            svggo: {},
                            webp: {
                                quality: 65
                            }
                        }
                    },
                ],
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                include: '/build/contracts/'
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                optimizationLevel: 7,
                            },
                            pngquant: {
                                quality: 65,
                            },
                            svggo: {},
                            webp: {
                                quality: 65
                            }
                        }
                    },
                ],
            }
        ]
    }, 
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'http://ec2-52-53-167-24.us-west-1.compute.amazonaws.com:2345': process.env.REACT_APP_SOCKET_SERVER_URL,
                // 'BAR': process.env.REACT_APP_GAME_SERVER_URL
            }
        })
        //   new ExtractTextPlugin('./client/styles/main.css', {
        //     allChunks: true
        //   }),
        // new OptimizeCssAssetsPlugin({
        //   assetNameRegExp: /\.optimize\.css$/g,
        //   cssProcessor: require('cssnano'),
        //   cssProcessorOptions: { discardComments: { removeAll: true } },
        //   canPrint: true
        // }),
    ]
}

