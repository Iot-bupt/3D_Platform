//处理默认进入时的URL


module.exports = {
    'GET /demo': async (ctx, next) => {
        ctx.render('index_test.html');
    },
    'GET /sites': async (ctx, next) => {
        ctx.render('sites.html');
    },
    'GET /home': async (ctx, next) => {
        ctx.render('home.html');
    },

};
