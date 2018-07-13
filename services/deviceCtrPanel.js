const axios = require('axios');
const request = require('superagent');

var instance = axios.create({
    baseURL: 'http://39.104.189.84:30080/api/v1',
    timeout: 10000,
  });

global.requestId = 100000;

module.exports = {  

    getAllDeviceAttr: async (deviceId) => {     //获取设备所有属性信息
        try{
            var data = await instance.get('/deviceaccess/allattributes/'+deviceId);
            var info = data.data;

            return info;
        }catch(e){
            throw e;
        }
    },

    getCtrPanel: async (manufacturerName,deviceTypeName,modelName) => {     //获取设备所有属性信息
        try{
            var data = await instance.get('/servicemanagement/ability/'+manufacturerName+'/'+deviceTypeName+'/'+modelName);
            var info = data.data;

            return info;
        }catch(e){
            throw e;
        }
    },

    sendControl: async (deviceId,body)=>{

        try{
            requestId--;
            
            var res = await request.post('http://39.104.189.84:30080/api/v1/deviceaccess/rpc/'+deviceId+'/'+requestId)
                .set('Content-Type', 'application/json; charset=utf-8')
                .send(body)
                .timeout({
                    response: 5000,
                    deadline: 10000,
                });
            
            console.log(res.text);
            if (res.text.indexOf("de")!=-1){
                //调用失败
                return "device is offline" + res.text;
            }

            return res.text;
            
        } catch(e){
            throw e;
        }
    },

    //历史数据展示使用
    getAllKeys: async (deviceId) => {     //获取设备主键
        try{
            var data = await instance.get('/deviceaccess/data/allKeys/'+deviceId);
            var info = data.data;

            return info;
        }catch(e){
            throw e;
        }
    },

    getHistoricalData: async (deviceId,newSearch) => {     //获取设备历史数据
        try{
            var data = await instance.get('/deviceaccess/data/alldata/'+deviceId+newSearch);
            var info = data.data;

            return info;
        }catch(e){
            throw e;
        }
    },
        

}