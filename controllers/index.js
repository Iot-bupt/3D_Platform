//处理默认进入时的URL
const index = require('../services/index.js');

const APIError = require('../rest').APIError;

var tenantId;
module.exports = {
    'GET /': async (ctx, next) => {
        try{
            tenantId = ctx.query.id;
            // ctx.session.user = tenantId;
            // ctx.body = { success: true, msg: '登录成功！' }; 
            // console.log(ctx.session);
            // if(!ctx.session.atoken){
            var token =  await index.getToken();
            if(!token){
                ctx.response.redirect('http://39.104.84.131/signin');
            }else{

            }
            // }
            
            ctx.render('home.html',{
                tenantId:tenantId
            });
    }catch(e){
        throw new APIError('login: failed','未登陆' +  e.message);
    }
    },
    'GET /demo': async (ctx, next) => {
        ctx.render('demo.html');
        
    },
    'GET /baidu': async (ctx, next) => {
        ctx.render('baiduDemo.html');
    },
    'GET /sitesList': async (ctx, next) => {
        ctx.render('sitesList.html');
    },
    'GET /demoupload': async (ctx, next) => {
        ctx.render('upload.html');
    },

};
