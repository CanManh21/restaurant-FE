module.exports = {
    devServer: {
      proxy: 'http://localhost:8091/',
      },
    publicPath: '/',
    lintOnSave: false,
    transpileDependencies: [
        'vuetify'
    ]
}
