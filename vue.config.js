module.exports = {
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: []
        }
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/price_checker/' : '/'
}
