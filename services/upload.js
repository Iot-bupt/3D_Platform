const fs = require('fs');
const path = require('path');
const moment = require('moment');
const uuid = require('uuid');

function generateId() {
    
    return uuid.v1();   //根据时间戳生成id
}

module.exports = {
    uploadScene: async (files) => {
        if(files.length>0){  
            for(var item of files){  
                
                var tmpath = item.path;  
                var tmparr = item.name.split('.');  
                var ext ='.'+tmparr[tmparr.length-1];  
                var newpath =path.join('public/upload/scenes', generateId()+'%'+item.name);  
                
                console.log(newpath); 
                const defaults = {
                    flags: 'a+',
                    encoding: 'utf8',
                    fd: null,
                    mode: 0o666,
                    autoClose: true
                  };
                var stream = fs.createWriteStream(newpath,defaults);//创建一个可写流  
                fs.createReadStream(tmpath).pipe(stream);//可读流通过管道写入可写流  
            } 
            var time = moment().format();
            var resData = {
                uploadTime:time,
                res:"success",
                url:newpath
            }
            
            return resData;
        }else{
            return null;
        }  
        
        
    }
};