const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
    function isDevelopment(){
        return argv.mode === 'development'
    }
    let config = {
        entry: {
            editor: './src/editor.js',
            front: './src/front.js'
        },
        output: {
            filename: '[name].js'
        },
        optimization: {
            minimizer: [
                new OptimizeCssAssetsPlugin(), 
                new TerserPlugin()
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ],
        devtool: isDevelopment() ? 'cheap-module-source-map' : 'source-map', 
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                [
                                    '@babel/preset-react',
                                    {
                                        "pragma": "React.createElement",
                                        "pragmaFrag": "React.Fragment",
                                        "development": isDevelopment()
                                    }
                                ]
                            ]
                        }
                    }
                }, 
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        autoprefixer()
                                    ]
                                }
                            } 
                        },
                        "sass-loader",
                    ]
                }
            ]
        },
        externals: {
            "@wordpress/blocks": ["wp", "blocks"], 
            "@wordpress/i18n": ["wp", "i18n"], 
        }
    }
    return config;
}