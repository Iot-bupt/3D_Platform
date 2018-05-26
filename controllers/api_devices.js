//处理rest相关的URL
//在这里数据库返回的数据返给前端，放在.rest({})里面  
//对于不同表的api接口操作，就在controllers下面建不同的api.js文件

const devices = require('../services/devices.js');

const APIError = require('../rest').APIError;

module.exports = {
    'GET /api/3d815/search/:id': async (ctx, next) => {
        var tid = ctx.params.id;
        var sText = ctx.query.textSearch;
        var limit = ctx.query.limit;
        var res = await devices.searchByText(tid,sText,limit);     //通过await执行promise对象，拿到结果
        ctx.rest({
            res: res
        });
    },

    'GET /api/3d815/getdata/:id':async (ctx,next) =>{     //遥测数据
        var id = ctx.params.id;
        var res = await devices.getDeviceData(id);

        ctx.rest({
            res: res
        });
    },

    'GET /api/3d815/getDeviceInfo/:id': async (ctx, next) => {    
        var id = ctx.params.id;
        var res = await devices.getDeviceInfo(id);
        ctx.rest(res);
    },

    'GET /api/3d815/controlSwitch/:id': async (ctx, next) => {    
        var id = ctx.params.id;
        var res = await devices.controlSwitch(id);
        ctx.rest(res);
    },
    'GET /api/3d815/controlCurtain/:id': async (ctx, next) => {    
        var id = ctx.params.id;
        var res = await devices.controlCurtain(id);
        ctx.rest(res);
    },

    'GET /api/3d815/paging/:tenantId': async (ctx, next) => {      //租户设备分页
        var tid = ctx.params.tenantId;
        var limit = ctx.query.limit;
        var idOffset = ctx.query.idOffset;
        var textOffset = ctx.query.textOffset;
        var res = await devices.devicesPaging(tid,limit,idOffset,textOffset);
        
        ctx.rest(res);
    },


    

    // 'GET /api/tenantscenes/:id': async (ctx,next)=>{
    //     var tenantId = ctx.params.id;
    //     var res = await scenes.getSceneByTenentId(tenantId);

    //     ctx.rest({
    //         scenes: res
    //     });
    // },


    // 'POST /api/scenes': async (ctx, next) => {     //创建场景
    //     var res = await scenes.createScene(ctx.request.body.name, ctx.request.body.tenantId);
    //     ctx.rest(res);
    // },

    // 'DELETE /api/scenes/:id': async (ctx, next) => {   //删除场景，失败res=0,成功=1
    //     console.log(`delete scene ${ctx.params.id}...`);
    //     var s = await scenes.deleteScene(ctx.params.id);
    //     if (s) {
    //         ctx.rest(s);
    //     } else {
    //         throw new APIError('scene:not_found', 'scene not found by id.');
    //     }
    // },

    // 'PUT /api/scenes/:id': async (ctx,next) => {
    //     console.log(`update scenename ${ctx.params.id}...`);
    //     var s = await scenes.renameScene(ctx.params.id,ctx.request.body.name);
    //     if (s[0] === 1) {
    //         ctx.rest(s);
    //     } else {
    //         throw new APIError('scene:not_found', 'scene not found by id.');
    //     }
    // },

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
