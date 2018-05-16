//处理rest相关的URL
//在这里数据库返回的数据返给前端，放在.rest({})里面  
//对于不同表的api接口操作，就在controllers下面建不同的api.js文件

const sites = require('../DBservices/sites.js');

const APIError = require('../rest').APIError;

module.exports = {
    'GET /api/sites': async (ctx, next) => {
        var res = await sites.getSites();     //通过await执行promise对象，拿到结果
        ctx.rest({
            sites: res
        });
    },

    'GET /api/sites/:id':async (ctx,next) =>{      //or name
        var siteId = ctx.params.id;
        if (!isNaN(siteId)){
        var res = await sites.getSiteById(siteId);
        ctx.rest({
            sites: res
        });
        }else{
            var res = await sites.getSiteByName(siteId);
            ctx.rest({
                sites:res
            });
        }
    },


    'GET /api/tenantsites/:id': async (ctx,next)=>{
        var tenantId = ctx.params.id;
        var res = await sites.getSiteByTenentId(tenantId);

        ctx.rest({
            sites: res
        });
    },


    'POST /api/sites': async (ctx, next) => {     //创建场景
        var data = ctx.request.body;
        var res = await sites.createSite(data.name, data.tenantId,data.longtitude,
                            data.latitude);
        ctx.rest(res);
    },

    'DELETE /api/sites/:id': async (ctx, next) => {   //删除场景，失败res=0,成功=1
        console.log(`delete site ${ctx.params.id}...`);
        var s = await sites.deleteSite(ctx.params.id);
        if (s) {
            ctx.rest(s);
        } else {
            throw new APIError('site:not_found', 'site not found by id.');
        }
    },

    'PUT /api/sites/:id': async (ctx,next) => {
        console.log(`update sitename ${ctx.params.id}...`);
        var s = await sites.renameSite(ctx.params.id,ctx.request.body.name);
        if (s[0] === 1) {
            ctx.rest(s);
        } else {
            throw new APIError('site:not_found', 'site not found by id.');
        }
    },

    /*  参数：即url后面/:id部分，一个/test/中间只有一个参数，？后面接的是query串，在ctx.query里面
       可以拿到url中的query参数和值。*/
    // 'GET /api/test/:id': async (ctx,next) =>{
    //     var id = ctx.params.id;
    //     var name = ctx.query.name;
        
    //     console.log(id+' '+name);
    // },
    // 'GET /api/sites': async (ctx, next) => {
    //          //通过await执行promise对象，拿到结果
    //     var res = await scenes.getSites(); 
    //     console.log('cnm');
    //     ctx.rest({
    //         scenes: res
    //     });
    // },

};
