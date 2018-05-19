//处理默认进入时的URL


module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('home.html');
    },
    'GET /demo': async (ctx, next) => {
        ctx.render('demo.html');
    },
    'GET /baidu': async (ctx, next) => {
        ctx.render('baiduDemo.html');
    },
    'GET /upload': async (ctx, next) => {
        ctx.render('upload.html');
    },

};
