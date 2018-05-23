const axios = require('axios');

var instance = axios.create({
    baseURL: 'http://39.104.84.131:8100/api/v1',
    timeout: 1000,
  });
  instance.defaults.headers.post['content-Type'] = 'appliction/json';

global.requestId = 100000;

function getDeviceId(id){
    var deviceId;
    switch (id){
        case 'uid1':
            deviceId = "25d469a0-5d73-11e8-a6b5-59c2cc02320f";  //switch1
            break;
        case 'uid2':
            deviceId = "25e05080-5d73-11e8-a6b5-59c2cc02320f";  //switch2
            break;
        case 'uid3':
            deviceId = "2957c400-5d73-11e8-a6b5-59c2cc02320f";  //c1
            break;
        case 'uid4':
            deviceId = "286c5290-5d73-11e8-a6b5-59c2cc02320f";  //wenshi
            break;
        case 'uid5':
            deviceId = "2900f170-5d73-11e8-a6b5-59c2cc02320f";   //c2
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
            var curStatus = data.data[0].value;
            
            var uid_data = await instance.get('/allattributes/'+deviceId);
            var uid = uid_data.data[21].value;
            requestId--;
            
            var res = await instance.post('/rpc/'+deviceId+'/'+requestId,{
                "methodName":"setStatus",
                "uid":uid,
                "status":Boolean((!curStatus))
            });
            
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
            return "Error:"+ e.message;
        }
    }
    

}