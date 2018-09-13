//处理默认进入时的URL
const index = require('../services/index.js');

const APIError = require('../rest').APIError;

const Cookies = require('cookies');

var tenantId;
module.exports = {
    'GET /': async (ctx, next) => {
        try{
            tenantId = ctx.query.id;
            var jsessionId = ctx.query.jsessionId;

            ctx.cookies.set('JSESSIONID',jsessionId,{
                            path:'/',   //cookie写入的路径
                            maxAge:1000*60*60*1,
                        });
            
            var cookie = ctx.req.headers.cookie;
            
            // ctx.session.user = tenantId;
            // ctx.body = { success: true, msg: '登录成功！' }; 
            // console.log(ctx.session);
            // if(!ctx.session.atoken){
            
            await index.getToken(cookie).then(function(res){
                let token = res.text;
                ctx.cookies.set('access_token',token,{
                    path:'/',   //cookie写入的路径
                    maxAge:1000*60*60*1,
                });

                return index.checkToken(token);
            })
            .then(function(res) {
                var userInfo = JSON.parse(res.text);
                var tenantId = userInfo.tenant_id;
                var customerId = userInfo.customer_id;
                var userId = userInfo.user_id;
                var userLevel = userInfo.authority;
                
                ctx.cookies.set('tenant_id',tenantId,{
                    path:'/',   //cookie写入的路径
                    maxAge:1000*60*60*1,
                });
                ctx.cookies.set('customerId',customerId,{
                    path:'/',   //cookie写入的路径
                    maxAge:1000*60*60*1,
                });
                ctx.cookies.set('userId',userId,{
                    path:'/',   //cookie写入的路径
                    maxAge:1000*60*60*1,
                });
                ctx.cookies.set('userLevel',userLevel,{
                    path:'/',   //cookie写入的路径
                    maxAge:1000*60*60*1,
                });

                ctx.render('home.html',{
                tenantId:tenantId,
                jsessionId:jsessionId
                });

            })
            .catch(function(){
                ctx.response.redirect('http://39.104.84.131/signin');
                console.log("err");
                
            });//耶，用promise，加await成了，第一次用用对了
            
            // await index.getToken(ctx,cookie,(res)=>{
            //     token = res.text;
            //     console.log(token);
            // },()=>{
            //     console.log('err');
            //     ctx.render('demo.html');
            // });

            // ctx.render('home.html',{
            //     tenantId:tenantId,
            //     jsessionId:jsessionId
            // });
           
            
                                   
        
    }catch(e){
        throw new APIError('login: failed','未登陆' +  e.message);
    }
    },
    'GET /demo': async (ctx, next) => {
        ctx.render('demo.html');
        
    },
    'GET /baidu': async (ctx, next) => {
        var access_token = ctx.cookies.get('access_token');
        ctx.render('baiduDemo.html');
    },
    'GET /sitesList': async (ctx, next) => {
        ctx.render('sitesList.html');
    },
    'GET /demoupload': async (ctx, next) => {
        ctx.render('upload.html');
    },

};
