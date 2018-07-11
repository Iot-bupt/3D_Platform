

const deviceCtrPanel = require('../services/deviceCtrPanel.js');

const APIError = require('../rest').APIError;

module.exports = {

    'GET /api/dCtrPanel/getAllDeviceAttr/:id': async (ctx, next) => {
        try{
            var deviceId = ctx.params.id;
        
            var res = await deviceCtrPanel.getAllDeviceAttr(deviceId);    
            ctx.rest({
                res: res
            });
        }catch(e){
            throw new APIError('dCTRPanel: failed','get device allATTR failed.' + e.message);
        }
        
    },
};