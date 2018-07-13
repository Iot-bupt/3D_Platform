const axios = require('axios');
const request = require('superagent');

var instance = axios.create({
    baseURL: 'http://39.104.189.84:30080/api/v1/deviceaccess',
    timeout: 10000,
  });

global.requestId = 100000;

function getDeviceId(id){
    var deviceId;
    switch (id){
        case 'uid1':
            deviceId = "1ecde350-6252-11e8-b8df-59c2cc02320f";  //switch1
            break;
        case 'uid2':
            deviceId = "1edd2590-6252-11e8-b8df-59c2cc02320f";  //switch2  不可用
            break;
        case 'uid3':
            deviceId = "22acf240-6252-11e8-b8df-59c2cc02320f";  //c1
            break;
        case 'uid4':
            deviceId = "21b94370-6252-11e8-b8df-59c2cc02320f";  //wenshi
            break;
        case 'uid5':
            deviceId = "22649ea0-6252-11e8-b8df-59c2cc02320f";   //c2  不可用
            break;
        default:
            deviceId = null;
    }
    return deviceId;
}

module.exports = {
  
    searchByText:async (tid,sText,limit)=>{
        var data =await instance.get('/tenant/devices/'+tid+'?limit='+limit+'&textSearch='+sText);

        return data.data;
        console.log(data.data);
    },

    getDeviceData: async (id)=>{
        var deviceId = getDeviceId(id);
        var data = await instance.get('/data/alllatestdata/'+deviceId);
        var yaoce = data.data

        return yaoce;
    },

    controlSwitch: async (id,turn)=>{
        var deviceId = getDeviceId(id);
        var status = false;
        if (turn === 'on'){
            status = true;
        }
        
        try{
            var uid_data = await instance.get('/allattributes/'+deviceId);
            var uid = uid_data.data[21].value;
            requestId--;
            
            var res = await request.post('http://39.104.189.84:30080/api/v1/deviceaccess/rpc/'+deviceId+'/'+requestId)
                .set('Content-Type', 'application/json')
                .send({"serviceName":"control switch"})
                .send({"methodName":"setstate"})
                .send({"uid":uid})
                .send({"status":status})
                .timeout({
                    response: 5000,
                    deadline: 10000,
                });
            
            console.log(res.text);
            if (res.text.indexOf("de")!=-1){
                //调用失败
                return res.text;
            }else if (status === true){
                    return "on"+res.text;
            }else if(status === false){
                return "off"+res.text;
            }else{
                throw new Error('server error!');
            }
            
        } catch(e){
            return e.message;
        }
    },
    controlCurtain: async (id,turn)=>{
        var deviceId = getDeviceId(id);
        var status = false;
        if (turn === 'on'){
            status = true;
        }
        try{
            
            var uid_data = await instance.get('/allattributes/'+deviceId);
            var uid = uid_data.data[21].value;
            requestId--;
            
            var res = await request.post('http://39.104.189.84:30080/api/v1/deviceaccess/rpc/'+deviceId+'/'+requestId)
                .set('Content-Type', 'application/json')
                .send({"serviceName":"control curtain"})
                .send({"methodName":"setstate"})
                .send({"uid":uid})
                .send({"status":status})
                .timeout({
                    response: 5000,
                    deadline: 10000,
                });
            
            console.log(res.text);
            if (res.text.indexOf("de")!=-1){
                //调用失败
                return res.text;
            }else if (status === true){
                    return "on"+res.text;
            }else if(status === false){
                return "off"+res.text;
            }else{
                throw new Error('server error!');
            }
            
        } catch(e){
            return e.message;
        }
    },

    devicesPaging: async (tid,limit,idOffset,textOffset) => {
        try{
            if ((idOffset) || (textOffset)){
            var data = await instance.get('/tenant/devices/'+tid+'?limit='+limit+'&idOffset='+idOffset+'&textOffset='+textOffset);
            var res = data.data;

            }else if (!(idOffset) && !(textOffset)){
                var data = await instance.get('/tenant/devices/'+tid+'?limit='+limit);
                var res = data.data;
            }
            return res;
        }catch(e){
            throw e;
        }
    },

    getDeviceInfo: async (id) => {     //获取设备属性信息
        try{
            var data = await instance.get('/device/'+id);
            var info = data.data;

            return info;
        }catch(e){
            throw e;
        }
    },

    siteDevicesPaging: async (tid,siteId,limit,idOffset,textOffset) => {
        try{
            if ((idOffset) && (textOffset)){
            var data = await instance.get('/sitedevices/'+tid+'/'+siteId+'?limit='+limit+'&idOffset='+idOffset+'&textOffset='+textOffset);
            var res = data.data;

            }else if (!(idOffset) && !(textOffset)){
                var data = await instance.get('/sitedevices/'+tid+'/'+siteId+'?limit='+limit);
                var res = data.data;
            }
            return res;
        }catch(e){
            throw e;
        }
    },

    siteDevicesSearch: async (tid,siteId,limit,textSearch) => {   //待定,底层接口有问题
        try{
            var data = await instance.get('/sitedevices/'+tid+'/'+siteId+'?limit='+limit+'&textSearch='+textSearch);
            var res = data.data;
     
            return res;
        }catch(e){
            throw e;
        }
    },


    assignDevicetoSite: async(id,tenantId,name,siteId) =>{
        try{
            var res = await request.post('http://39.104.189.84:30080/api/v1/deviceaccess/assign/site')
                .set('Content-Type', 'application/json')
                .send({"id":id})
                .send({"tenantId":tenantId})
                .send({"name":name})
                .send({"siteId":siteId})
                .timeout({
                    response: 5000,
                    deadline: 10000,
                });

            if (res.text){
                return res.text;
            }else{
                throw new Error('server error!');
            }
        }catch(e){
            throw e;
        }

    }
    

}