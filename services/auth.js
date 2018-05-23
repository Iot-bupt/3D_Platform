
const config = require('./authConfig');

const request = require('superagent');

  
module.exports = {
    login: async (username,password) => {
        
        var buff = new Buffer(config.client_id+':'+config.client_secret);
        var base64 = buff.toString('base64');
        var authorization = "Basic " + base64;

        try{
            var res =  await request.post('http://39.104.165.155:8081/api/v1/auth/login?grant_type=password')
            .type('form')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', authorization)
            .send({username:username})
            .send({password:password});
            
            return res.body;     //async函数return的时候会返回一个promise对象
        }catch(e){
            var message = e.response.body.error_description;
            throw new Error(message);
        }
    },
};