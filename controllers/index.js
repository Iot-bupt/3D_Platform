//处理默认进入时的URL

var tenantId;
module.exports = {
    'GET /': async (ctx, next) => {
        tenantId = ctx.query.id;
        ctx.render('home.html',{
            tenantId:tenantId
        });
    },
    'GET /demo': async (ctx, next) => {
        ctx.render('demo.html');
    },
    'GET /baidu': async (ctx, next) => {
        ctx.render('baiduDemo.html');
    },
    'GET /demoupload': async (ctx, next) => {
        ctx.render('upload.html');
    },

};
