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
        var turn = ctx.query.turn;
        var res = await devices.controlSwitch(id,turn);
        ctx.rest(res);
    },
    'GET /api/3d815/controlCurtain/:id': async (ctx, next) => {    
        var id = ctx.params.id;
        var turn = ctx.query.turn;
        var res = await devices.controlCurtain(id,turn);
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

    'GET /api/3d815/siteDevicePaging/:tenantId/:siteId': async (ctx, next) => {      //租户站点下设备分页
        var tid = ctx.params.tenantId;
        var siteId = ctx.params.siteId;
        var limit = ctx.query.limit;
        var idOffset = ctx.query.idOffset;
        var textOffset = ctx.query.textOffset;
        var res = await devices.siteDevicesPaging(tid,siteId,limit,idOffset,textOffset);
        
        ctx.rest(res);
    },

    'GET /api/devices/siteSearch/:tenantId/:siteId': async (ctx, next) => {      //租户站点下设备搜索
        var tid = ctx.params.tenantId;
        var siteId = ctx.params.siteId;
        var limit = ctx.query.limit;
        var textSearch = ctx.query.textSearch;
        var res = await devices.siteDevicesSearch(tid,siteId,limit,textSearch);
        
        ctx.rest(res);
    },

    'PUT /api/assignDevice/site': async (ctx,next) => {
        
        var body = ctx.request.body;
        var s = await devices.assignDevicetoSite(body.id,body.siteId);
        if (s) {
            ctx.rest(s);
        } else {
            throw new APIError('site:assign failed', 'sites or devices error');
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
