const axios = require('axios');
const request = require('superagent');

var instance = axios.create({
    baseURL: 'http://39.104.189.84:30080/api/v1',
    timeout: 2000,
  });

global.requestId = 100000;

module.exports = {  

    getAllDeviceAttr: async (id) => {     //获取设备所有属性信息
        try{
            var data = await instance.get('/deviceaccess/allattributes/'+id);
            var info = data.data;

            return info;
        }catch(e){
            throw e;
        }
    },

 //以下还没写
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
            
            var res = await request.post('http://39.104.84.131:8100/api/v1/rpc/'+deviceId+'/'+requestId)
                .set('Content-Type', 'application/json')
                .send({"serviceName":"control switch"})
                .send({"methodName":"setstate"})
                .send({"uid":uid})
                .send({"status":status})
                .timeout({
                    response: 3000,
                    deadline: 5000,
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
    
   

    assignDevicetoSite: async(id,tenantId,name,siteId) =>{
        try{
            var res = await request.post('http://39.104.84.131:8100/api/v1/assign/site')
                .set('Content-Type', 'application/json')
                .send({"id":id})
                .send({"tenantId":tenantId})
                .send({"name":name})
                .send({"siteId":siteId})
                .timeout({
                    response: 5000,
                    deadline: 5000,
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