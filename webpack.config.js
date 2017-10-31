const dev = process.env.NODE_ENV === "dev";
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const exec = require('child_process').exec;
const uglifyJs = require('uglifyjs-webpack-plugin');

const indexConfig = {
    template: './index.html',
    excludeChunks: ['electron']
};

let webpackConfig = {
    // How source maps are generated : style of source mapping
    devtool: dev ? 'eval-cheap-module-source-map' : false,
    // Development server configuration 
    devServer: {
        // Execute custom middleware after all other middleware internally within the server
        after() {
            // Fix whitescreen bug on build with Electron BrowserWindow
            exec('electron . --dev');
        }
    },
    // Where webpack looks to start building the bundle
    entry: {
        'electron': './electron',
        'app': './app/main.ts'
    },
    // How the different types of modules within a project will be treated
    module: {
        rules: [
            {
                // All files with a '.ts' extension will be handled by ts-loader
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    // Configure how modules are resolved
    resolve: {
        extensions: [".ts", ".js"]
    },
    // How and where webpack should output bundles, assets and anything else
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js'
    },
    // What bundle information gets displayed
    stats: {
        warnings: false
    },
    // Target a specific environment (cf. doc)
    target: 'electron-main',
    // Configure whether to polyfill or mock certain Node.js globals and modules
    node: {
        __dirname: false
    },
    // Customize the webpack build process with additionals plugins
    plugins: [
        new htmlWebpackPlugin(indexConfig)
    ]
};

// UglifyJs only for prod
if(!dev) {
    webpackConfig.plugins.push(new uglifyJs());
}

// Export the config
module.exports = webpackConfig;