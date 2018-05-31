const dModel = require('../services/devicesModel.js');

const APIError = require('../rest').APIError;

module.exports = {
    'POST /api/dModel/createModel/:tenantId/:siteId': async (ctx,next)=>{
        var tid = ctx.params.tenantId;
        var siteId = ctx.params.siteId;
        var body = ctx.request.body;
        var res = await dModel.createModel(tid,siteId,body);

        ctx.rest(res)
    },
}