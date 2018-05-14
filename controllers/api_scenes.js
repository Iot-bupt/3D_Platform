//处理rest相关的URL
//在这里数据库返回的数据返给前端，放在.rest({})里面  
//对于不同表的api接口操作，就在controllers下面建不同的api.js文件

const scenes = require('../scenes.js');

const APIError = require('../rest').APIError;

module.exports = {
    'GET /api/scenes': async (ctx, next) => {
        var res = await scenes.getScenes();     //通过await执行promise对象，拿到结果
        ctx.rest({
            scenes: res
        });
    },

    'GET /api/scenes/:id':async (ctx,next) =>{
        var sceneId = ctx.params.id;
        var res = await scenes.getSceneById(sceneId);

        ctx.rest({
            scenes: res
        });
    },

    'GET /api/scenesname/:name': async (ctx,next)=>{
        var sceneName = ctx.params.name;
        var res = await scenes.getSceneByName(sceneName);

        ctx.rest({
            scenes: res
        });
    },

    'GET /api/tenantscenes/:id': async (ctx,next)=>{
        var tenantId = ctx.params.id;
        var res = await scenes.getSceneByTenentId(tenantId);

        ctx.rest({
            scenes: res
        });
    },


    'POST /api/scenes': async (ctx, next) => {     //创建场景
        var res = await scenes.createScene(ctx.request.body.name, ctx.request.body.tenantId);
        ctx.rest(res);
    },

    'DELETE /api/scenes/:id': async (ctx, next) => {   //删除场景，失败res=0,成功=1
        console.log(`delete scene ${ctx.params.id}...`);
        var s = await scenes.deleteScene(ctx.params.id);
        if (s) {
            ctx.rest(s);
        } else {
            throw new APIError('scene:not_found', 'scene not found by id.');
        }
    }
};
