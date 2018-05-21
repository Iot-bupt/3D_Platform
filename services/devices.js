const axios = require('axios');

var instance = axios.create({
    baseURL: 'http://39.104.186.210:8100/api/v1',
    timeout: 1000,
  });


function getDeviceId(id){
    var deviceId;
    switch (id){
        case 'uid1':
            deviceId = "cfebe9c0-5a78-11e8-b66a-e5d2dad89b7c";  //switch3
            break;
        case 'uid2':
            deviceId = "d076ebb0-5a78-11e8-b66a-e5d2dad89b7c";  //switch4
            break;
        case 'uid3':
            deviceId = "d1bd2751-5a78-11e8-b66a-e5d2dad89b7c";
            break;
        case 'uid4':
            deviceId = "d11156f0-5a78-11e8-b66a-e5d2dad89b7c";
            break;
        case 'uid5':
            deviceId = "d1bd2750-5a78-11e8-b66a-e5d2dad89b7c";
            break;
        default:
            deviceId = null;
    }
    return deviceId;
}

module.exports = {
  
    searchByText:async (text)=>{
        var searchText = text;
        var data =await instance.get('tenant/devices/2?limit=10&textSearch='+searchText);

        return data;
        console.log(data);
    },

    getDeviceData: async (id)=>{
        var deviceId = getDeviceId(id);
        var data = await instance.get('/data/alllatestdata/'+deviceId);
        var yaoce = data.data

        return yaoce;
    },

    controlDevices: async (id)=>{
        var deviceId = getDeviceId(id);
        try{
            var data = await instance.get('/data/alllatestdata/'+deviceId);
            var curStatus = data[0].value;
            //var uid = 查设备属性
            global.requestId = Number.MAX_SAFE_INTEGER;
            var res = await instance.post('/rpc/'+id+'/'+requestId,{
                "methodName":"setStatus",
                "uid":deviceId,
                "status":Number(!curStatus)
            });
            requestId--;
            console.log(res);
            if (res.indexOf("ha")!=-1){
                //调用成功
                if (curStatus === 0){
                    return "on";
                }else{
                    return "off";
                }
            }else{
                return res;
            }
            
        } catch(e){
            return "Error:设备未找到！"+ e.message;
        }
    }
    

}