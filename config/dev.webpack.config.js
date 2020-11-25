/* global module, __dirname */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('../package.json').dependencies;
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    https: true,
    debug: true
});

plugins.push(new ModuleFederationPlugin({
    name: 'inventory',
    filename: 'inventory.[hash].js',
    library: { type: 'var', name: 'inventory' },
    exposes: {
        './RootApp': './src/AppEntry'
    },
    shared: [
        { react: { singleton: true, requiredVersion: deps.react } },
        { 'react-dom': { singleton: true, requiredVersion: deps['react-dom'] } }
    ]
}));

plugins.push(new(require('./chunk-mapper'))({ modules: 'inventory' }));

module.exports = {
    ...webpackConfig,
    plugins
};
