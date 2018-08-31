const model = require('../database/model');


let Warning = model.Warning;


function newWarning(tenantId,deviceId,content) {
    this.tenantId = tenantId;
    this.deviceId = deviceId;
    this.content = content;
}

module.exports = {
    createWarning: async (tenantId,deviceId,content) => {

        try{
            var warnObj = new newWarning(tenantId,deviceId,content);
            var warning = await Warning.create(warnObj);
        
        return warning;
        }catch(e){
            throw e;
        }

    },

    pushToWs:async (tenantId,deviceId,content) => {
        try{
            var warnObj = new newWarning(tenantId,deviceId,content);
            var data = JSON.stringify(warnObj);

            var wss = global.wss;
            wss.pushMessage(tenantId,data);
        }catch(e){
            throw e;
        }

    }
};


