const request = require('superagent');

module.exports = {
getToken: async ()=>{

    try{
        var token = undefined;
        
        request.get('http://39.104.84.131/api/user/authorize')
            .timeout({
                response: 5000,
                deadline: 10000,
            })
            .end((err, res) => {
                if(err){
                    console.log(err);
                }else{
                    token = res;
                }
              });
        
        return token;
        
    } catch(e){
        throw e;
    }
},
sendControl: async (deviceId,body)=>{

    try{
        
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
}