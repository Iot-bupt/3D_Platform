//处理默认进入时的URL


module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index_test.html');
    },
    'GET /index': async (ctx, next) => {
        ctx.render('index.html');
    }
};
