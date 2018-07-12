

const deviceCtrPanel = require('../services/deviceCtrPanel.js');

const APIError = require('../rest').APIError;

module.exports = {

    'GET /api/dCtrPanel/getAllDeviceAttr/:deviceId': async (ctx, next) => {
        try{
            var deviceId = ctx.params.deviceId;
        
            var res = await deviceCtrPanel.getAllDeviceAttr(deviceId);    
            ctx.rest(res);
        }catch(e){
            throw new APIError('dCTRPanel: failed','get device allATTR failed.' + e.message);
        }
        
    },

    'GET /api/dCtrPanel/getCtrPanel/:manufacturerName/:deviceTypeName/:modelName': async (ctx, next) => {
        try{
            var manufacturerName = ctx.params.manufacturerName;
            var deviceTypeName = ctx.params.deviceTypeName;
            var modelName = ctx.params.modelName;
        
            var res = await deviceCtrPanel.getCtrPanel(manufacturerName,deviceTypeName,modelName);    
            ctx.rest(res);
        }catch(e){
            throw new APIError('dCTRPanel: failed','get device CtrPanel failed.' + e.message);
        }
        
    },

    'POST /api/dCtrPanel/sendControl/:deviceId': async (ctx,next)=>{
        try{
            var deviceId = ctx.params.deviceId;
            var body = ctx.request.body;

            var res = await deviceCtrPanel.sendControl(deviceId,body);

            ctx.rest(res);
        }catch(e){
            throw new APIError('dCTRPanel: failed','send control failed.' + e.message);
        }
    },

    //历史数据展示使用
    'GET /api/dCtrPanel/getAllKeys/:deviceId': async (ctx, next) => {
        try{
            var deviceId = ctx.params.deviceId;
        
            var res = await deviceCtrPanel.getAllKeys(deviceId);    
            ctx.rest(res);
        }catch(e){
            throw new APIError('dCTRPanel: failed','get device allKeys failed.' + e.message);
        }
        
    },

    'GET /api/dCtrPanel/getHistoricalData/:deviceId': async (ctx, next) => {
        try{
            var deviceId = ctx.params.deviceId;
            var search = ctx.search;
            
            var newSearch = search + "&aggregation=NONE&interval=100";
        
            var res = await deviceCtrPanel.getHistoricalData(deviceId,newSearch);    
            ctx.rest(res);
        }catch(e){
            throw new APIError('dCTRPanel: failed','get device historyData failed.' + e.message);
        }
        
    },
};