const request = require('superagent');

module.exports = {

    getToken: async (cookie,sessionId)=>{

        try{
            var p = new Promise(function(resolve, reject){
                request.get('http://39.104.84.131/api/user/authorize/'+ sessionId)
                .set('Cookie', cookie)
                .timeout({
                    response: 20000,
                    deadline: 20000,
                })
                .end((err, res) => {
                    if(err){
                        console.log(err);
                        reject();
                    }else{
                        resolve(res);
                    }
                });
            }) 

            return p;
                
        } catch(e){
            throw e;
        }
    },
    checkToken: async (token)=>{

        try{
            
            var p = new Promise(function(resolve, reject){ 
            request.post('http://39.104.189.84:30080/api/v1/account/check_token')
                .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
                .send({
                    token:token
                })
                .timeout({
                    response: 20000,
                    deadline: 20000,
                })
                .end((err, res) => {
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        resolve(res);
                    }
                });
            
            
            });
            

            return p;
            
        } catch(e){
            throw e;
        }
    },
}