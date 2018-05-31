const model = require('../database/model');

let devicesModel = model.devicesModel;


function dModel(name,tenantId,deviceId,siteId,location,dModelUrl) {
    this.name = name;
    this.tenantId = tenantId;
    this.deviceId = deviceId;
    this.siteId = siteId;
    this.location = location;
    this.deviceModelUrl = dModelUrl || '';
}

module.exports = {
    createModel: async(tid,siteId,body) => {
        var model = new dModel(body.name,tid,body.deviceId,siteId,body.location,body.dModelUrl);
        var res = await devicesModel.create(model);

        return res;
    },
}