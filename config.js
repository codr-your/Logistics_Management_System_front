module.exports = {
    devServer: {
        hot: false,
        proxy: {
            '/': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                bypass: function (req, res, proxyOptions) {
                    // html页面不转发，留给vue前端处理
                    if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
                        return '/index.html'
                    }
                }
            }
        }
    }
}